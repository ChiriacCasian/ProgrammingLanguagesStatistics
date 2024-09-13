import re
import json
import sys
from datetime import timezone, datetime

import mysql.connector
from scrapfly import ScrapflyClient, ScrapeConfig
from bs4 import BeautifulSoup
from scrapfly import *
from IndeedScrapFlyFs import *

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
                print("No salary given")
                salaryNum = None
            if(id is not None):
                # id, lang, assoc_lang, city, salary, date, lvl
                data = (progLang_to_code(progLang), None, city, salaryNum, mysqlDate, 3)
                insert_into_jobstable(cursor, indeed_db, data)
        url = next_page(url)
        pages += 1
        if(pages > maxpages):
            break
    cursor.close()
    indeed_db.close()

def clear_jobstable(schema_name, table_name):
    cursor, db = connect_to_mysql("localhost", 3406, "root", "12345rita", schema_name)
    query = "DELETE FROM " + table_name
    cursor.execute(query)
    db.commit()
    cursor.close()
    db.close()
    print("jobstable cleared !!")

clear_jobstable("indeed_db", "jobstable")
clear_jobstable("indeed_db_nl", "jobstable")
update_jobstable("java", "en", 100, "indeed_db")
update_jobstable("java", "nl", 100, "indeed_db_nl")