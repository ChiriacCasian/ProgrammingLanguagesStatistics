import re
import json
import sys
import mysql.connector
from scrapfly import ScrapflyClient, ScrapeConfig
from bs4 import BeautifulSoup
from scrapfly import *

def get_page_data(url):
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
    cursor.execute(query, data)
    db.commit()