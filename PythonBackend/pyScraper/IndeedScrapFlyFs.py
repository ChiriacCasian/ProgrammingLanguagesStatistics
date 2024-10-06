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
    try:
        scrapfly = ScrapflyClient(key="scp-live-9751df464c634d47ba47054350e0ee67")
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
    except:
        return {"results": []}
def update_jobstable_province(progLang, maxpages, schema_name, province, country):
    url = f"https://{country}.indeed.com/jobs?q={progLang}&l={province}&l=germany&start=0"
    cursor, indeed_db = connect_to_mysql("localhost", 3406, "root", "12345rita", schema_name)
    pages = 0
    while(jobs := get_page_data(url)["results"]):
        for job in jobs:
            try:
                timestamp_ms = job["createDate"]
                dt = datetime.fromtimestamp(timestamp_ms/1000.0, tz=timezone.utc)
                mysqlDate = dt.strftime('%Y-%m-%d %H:%M:%S')
            except:
                mysqlDate = None
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
                    elif numbers[0] > 1500 and numbers[0] < 6000: # if there is only one number then its the salary
                        salaryNum = numbers[0]
                # handles statistical outlier salaryNum
                if(salaryNum is not None and (salaryNum < 1500 or salaryNum > 20000)): salaryNum = None
            except:
                salaryNum = None

            if (salaryNum is not None) :
                # lang, city, salary, date
                data = (progLang_to_code(progLang),
                        province_to_code(province), salaryNum, mysqlDate, country_to_countryCode(country))
                print(data)
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
    query = "INSERT INTO jobstable (lang, city, salary, date, country) VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(query, data)
    db.commit()
def clear_jobstable(schema_name, table_name):
    cursor, db = connect_to_mysql("localhost", 3406, "root", "12345rita", schema_name)
    query = "DELETE FROM " + table_name
    cursor.execute(query)

    reset_query = f"ALTER TABLE {table_name} AUTO_INCREMENT = 1"
    cursor.execute(reset_query)

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


def province_to_code(province):
    switcher = {
        "Drenthe": 1,
        "Flevoland": 2,
        "Friesland": 3,
        "Gelderland": 4,
        "Groningen": 5,
        "Limburg": 6,
        "North Brabant": 7,
        "North Holland": 8,
        "Overijssel": 9,
        "South Holland": 10,
        "Utrecht": 11,
        "Zeeland": 12,

        "Baden-Wurttemberg": 1,
        "Bavaria": 2,
        "Berlin": 3,
        "Brandenburg": 4,
        "Bremen": 5,
        "Hamburg": 6,
        "Hesse": 7,
        "Lower-Saxony": 8,
        "Mecklenburg-Vorpommern": 9,
        "North-Rhine-Westphalia": 10,
        "Rhineland-Palatinate": 11,
        "Saarland": 12,
        "Saxony": 13,
        "Saxony-Anhalt": 14,
        "Schleswig-Holstein": 15,
        "Thuringia": 16
    }
    return switcher.get(province, 0)

def country_to_countryCode(country) :
    switcher = {
        "nl" : 0 ,
        "de" : 1
    }
    return switcher.get(country, 0) ; # default is nl
