import random
import time

from bs4 import BeautifulSoup
import requests
from itertools import cycle
from selenium import webdriver
from selenium.webdriver.common.by import By
from IndeedFs import *
import httpx

url = 'https://nl.indeed.nl'
langs = ['java']

# test cs1 cs2

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Connection": "keep-alive",
    "Accept-Language": "en-US,en;q=0.9,lt;q=0.8,et;q=0.7,de;q=0.6",
}

response = httpx.get("https://www.indeed.com/jobs?q=python&l=Texas", headers=HEADERS)
print(response)

# for lang in langs:
#     driver = setupSeleniumDriver(url)
#     pageManip(driver, lang)
#
#     page = driver.page_source
#     soup = BeautifulSoup(page, 'html.parser')
#     jobs = soup.find('div', id = 'mosaic-provider-jobcards')
#     if jobs is not None :
#         print('found')
#         jobs = jobs.find_all('li')
#         print(jobs.__sizeof__())
#         job = jobs[0]
#         print(job)
#         print(job[0].getText() + '\n')
#         print(job[1].getText() + '\n')
#         print(job[2].getText() + '\n')
#         print(job[3].getText() + '\n')
#         print(job[4].getText() + '\n')
#
#
#     time.sleep(3.22)
