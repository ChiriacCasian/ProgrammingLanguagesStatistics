import re
import json
import sys
from datetime import timezone, datetime

import mysql.connector
from scrapfly import ScrapflyClient, ScrapeConfig
from bs4 import BeautifulSoup
from scrapfly import *
from IndeedScrapFlyFs import *

lang = "java"
url="https://nl.indeed.com/jobs?q="+lang+"&l=netherlands&start=0"
cursor, indeed_db = connect_to_mysql("localhost", 3406, "root", "12345rita", "indeed_db")
pages = 0 # number of pages to scrape
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
            numbers = []
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
                else:
                    salaryNum = numbers[0] # if there is only one number then its the salary
        except:
            print("No salary given")
            salaryNum = None
        if(id is not None):
            # id, lang, assoc_lang, city, salary, date, lvl
            data = (1, None, city, salaryNum, mysqlDate, 3)
            insert_into_jobstable(cursor, indeed_db, data)
    url = next_page(url)
    pages += 1
    if(pages > 2):
        break

cursor.close()
indeed_db.close()

# cursor, indeed_db = connect_to_mysql("localhost", 3406, "root", "12345rita", "indeed_db")
# data = (12, 1, 5, 3200, "2021-09-12", 3)
# insert_into_jobstable(cursor, indeed_db, data)
# cursor.close()
# indeed_db.close()