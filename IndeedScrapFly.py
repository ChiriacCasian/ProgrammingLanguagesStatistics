import re
import json
import sys
import mysql.connector
from scrapfly import ScrapflyClient, ScrapeConfig
from bs4 import BeautifulSoup
from scrapfly import *
from IndeedScrapFlyFs import *

lang = "java"
url="https://nl.indeed.com/jobs?q="+lang+"&l=netherlands&start=0"
i = 0
while(jobs := get_page_data(url)["results"]):
    break
    for job in jobs:
        #print(job.keys())
        print(job["createDate"])
        print(job["jobLocationCity"])
        print(job["title"])
        print(job["salarySnippet"])
        print(job["jobCardRequirementsModel"])
        print('----------------------------------------\n')
    url = next_page(url)
    i += 1
    if(i > 0):
        break

cursor, indeed_db = connect_to_mysql("localhost", 3406, "root", "12345rita", "indeed_db")
if(indeed_db == None):
    print("Error connecting to mysql")
# Insert data
query = "INSERT INTO jobstable (id, lang, assoc_lang, salary, date, lvl) VALUES (%s, %s, %s, %s, %s, %s)"
data = (12, 1, 5, 3200, "2021-09-12", 3)
cursor.execute(query, data)

# Commit the transaction
indeed_db.commit()

cursor.close()
indeed_db.close()

    # soup = BeautifulSoup(job["jobCardContent"], 'html.parser')
    # print(soup.prettify() + '\n')