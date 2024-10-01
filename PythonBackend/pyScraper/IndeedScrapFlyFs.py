from datetime import timezone, datetime
import json
import sys
import mysql.connector
from scrapfly import ScrapflyClient, ScrapeConfig
from bs4 import BeautifulSoup
import re
import json
import sys
from datetime import timezone, datetime

import mysql.connector
from scrapfly import *

def get_page_data(url):
    scrapfly = ScrapflyClient(key="scp-live-d9f16672d5944a2eb8f22f33428c7c6f")
    result = scrapfly.scrape(
        ScrapeConfig(
            url=url,
            asp=True,
        )
    )
    data = re.findall(r'window.mosaic.providerData\["mosaic-provider-jobcards"\]=(\{.+?\});', result.content)
    data = json.loads(data[0])
    return {
        "results": data["metaData"]["mosaicProviderJobCardsModel"]["results"],
        "meta": data["metaData"]["mosaicProviderJobCardsModel"]["tierSummaries"],
    }
def update_jobstable(progLang, jobLang, maxpages, schema_name):
    url="https://nl.indeed.com/jobs?q="+ progLang + "&lang=" + jobLang + "&l=netherlands&start=0"
    cursor, indeed_db = connect_to_mysql("localhost", 3406, "root", "12345rita", schema_name)
    pages = 0
    while(jobs := get_page_data(url)["results"]):
        for job in jobs:
            #print(job.keys())
            #print(job["jobCardRequirementsModel"])
            try:
                id = (job["adId"])
                timestamp_ms = job["createDate"]
                dt = datetime.fromtimestamp(timestamp_ms/1000.0, tz=timezone.utc)
                mysqlDate = dt.strftime('%Y-%m-%d %H:%M:%S')
                city = job["jobLocationCity"]
            except:
                id = None
                mysqlDate = None
                city = None

            try:
                title = job["title"]
            except:
                title = None
            salaryNum = None
            try:
                salaryString = job["salarySnippet"]["text"]
                salary = re.findall(r'\d+', salaryString)
                if(len(salary) == 4):
                    numbers = [int(salary[0] + salary[1]), int(salary[2] + salary[3])]
                elif(len(salary) == 2):
                    numbers = [int(salary[0]), int(salary[1])]
                else:
                    numbers = [int(salary[0])]
                if(numbers is not None):
                    if(len(numbers) == 2 and numbers[1] <= 20000): # if the salary is < 20k then its monthly
                        salaryNum = int((numbers[0] + numbers[1]) / 2)
                    elif(len(numbers) == 2 and numbers[1] > 20000):
                        salaryNum = int((numbers[0] + numbers[1]) / 24) # if the salary is > 20k then its yearly
                    elif(len(numbers) == 1 and numbers[0] <= 300): # salary is per day
                        salaryNum = numbers[0] * 30
                    else: # if there is only one number then its the salary
                        salaryNum = numbers[0]
            except:
                salaryNum = None
            if(id is not None):
                # id, lang, assoc_lang, city, salary, date, lvl
                data = (progLang_to_code(progLang), None, city, salaryNum, mysqlDate, 3)
                insert_into_jobstable(cursor, indeed_db, data)
        url = next_page(url)
        print(pages)
        pages += 1
        if(pages > maxpages):
            break
    cursor.close()
    indeed_db.close()

def next_page(url):
    index = url.find("start=")
    if(index == -1):
        return url + "&start=0"
    index += 6
    #print(url[index])
    currentNr = ""
    while(index < len(url) and url[index].isdigit()):
        currentNr += url[index]
        index += 1
    #print(currentNr)
    intCurrentNr = int(currentNr)
    intCurrentNr += 10
    return url[:index-len(currentNr)] + str(intCurrentNr)

# returns a cursor and a connection to the database, don t forget to .close() them
def connect_to_mysql(host, port, user, password, database):
    # to start mysql server : services -> Mysql80 -> start
    try:
        # Connect to MySQL
        indeed_db = mysql.connector.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database
        )
        cursor = indeed_db.cursor()
        return (cursor, indeed_db)
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return f"Error: {err}", None

# lang is a number representing the language 1 is java, lvl is an int representing senior/junior/medior
def insert_into_jobstable(cursor, db, data):
    query = "INSERT INTO jobstable (lang, assoc_lang, city, salary, date, lvl) VALUES (%s, %s, %s, %s, %s, %s)"
    data.city = city_to_province(data.city)
    cursor.execute(query, data)
    db.commit()
def clear_jobstable(schema_name, table_name):
    cursor, db = connect_to_mysql("localhost", 3406, "root", "12345rita", schema_name)
    query = "DELETE FROM " + table_name
    cursor.execute(query)
    db.commit()
    cursor.close()
    db.close()
    print("jobstable cleared !!")
def progLang_to_code(progLang):
    switcher = {
        "java": 1,
        "javascript": 2,
        "python": 3,
        "c++": 4, # c++ and c are the same
        "kotlin": 5,
        "c#": 6,
        "swift": 7,
        "php": 8,
        "ruby": 9,
        "sql": 10,
        "html": 11,
        "r": 12,
        "go": 13,
        "rust": 14,
        "scala": 15,
        "dart": 16,
        "matlab": 17,
        "cobol": 18
    }
    return switcher.get(progLang.lower(), 0) # 0 is the mistery language

def city_to_province(city):
    switcher = {
        "Amsterdam": "Noord-Holland",
        "Rotterdam": "Zuid-Holland",
        "The Hague (Den Haag)": "Zuid-Holland",
        "Utrecht": "Utrecht",
        "Eindhoven": "Noord-Brabant",
        "Tilburg": "Noord-Brabant",
        "Groningen": "Groningen",
        "Almere": "Flevoland",
        "Breda": "Noord-Brabant",
        "Nijmegen": "Gelderland",
        "Enschede": "Overijssel",
        "Haarlem": "Noord-Holland",
        "Arnhem": "Gelderland",
        "Zaanstad": "Noord-Holland",
        "Amersfoort": "Utrecht",
        "Apeldoorn": "Gelderland",
        "Hoofddorp": "Noord-Holland",
        "Maastricht": "Limburg",
        "Leiden": "Zuid-Holland",
        "Dordrecht": "Zuid-Holland",
        "Zoetermeer": "Zuid-Holland",
        "Zwolle": "Overijssel",
        "Leeuwarden": "Friesland",
        "Helmond": "Noord-Brabant",
        "Den Bosch": "Noord-Brabant",
        "'s-Hertogenbosch": "Noord-Brabant",
        "Venlo": "Limburg",
        "Ede": "Gelderland",
        "Hengelo": "Overijssel",
        "Emmen": "Drenthe",
        "Oss": "Noord-Brabant",
        "Delft": "Zuid-Holland",
        "Deventer": "Overijssel",
        "Sittard-Geleen": "Limburg",
        "Roermond": "Limburg",
        "Vlaardingen": "Zuid-Holland",
        "Alkmaar": "Noord-Holland",
        "Amstelveen": "Noord-Holland",
        "Hilversum": "Noord-Holland",
        "Purmerend": "Noord-Holland",
        "Schiedam": "Zuid-Holland",
        "Zaandam": "Noord-Holland",
        "Hoorn": "Noord-Holland",
        "Gouda": "Zuid-Holland",
        "Veenendaal": "Utrecht",
        "Nieuwegein": "Utrecht",
        "Middelburg": "Zeeland",
        "Terneuzen": "Zeeland",
        "Capelle aan den IJssel": "Zuid-Holland",
        "Veldhoven": "Noord-Brabant",
        "Barendrecht": "Zuid-Holland",
        "Hellevoetsluis": "Zuid-Holland",
        "Spijkenisse": "Zuid-Holland",
        "Lelystad": "Flevoland",
        "Assen": "Drenthe",
        "Alphen aan den Rijn": "Zuid-Holland",
        "Rijswijk": "Zuid-Holland",
        "Heerlen": "Limburg",
        "Zeist": "Utrecht"
    }
    return switcher.get(city, "other") # "other" is the unidentified city
