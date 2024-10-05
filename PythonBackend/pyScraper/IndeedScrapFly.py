import re
import json
import sys
from datetime import timezone, datetime

import mysql.connector
from scrapfly import ScrapflyClient, ScrapeConfig
from bs4 import BeautifulSoup
from scrapfly import *
from IndeedScrapFlyFs import *

# Everythinng about scrapers : https://www.reddit.com/r/webscraping/comments/zg93ht/what_is_the_best_free_web_scraping_tool/
# 0 is en and 1 is nl
langlist = [ "java",
             "javascript",
             "python",
             "c++", # c++ and c are the same
             "kotlin",
             "c#",
             "swift",
             "php",
             "ruby",
             "sql",
             "html",
             "r",
             "go",
             "rust",
             "scala",
             "dart",
             "matlab",
             "cobol"]
provinces = [
    "Drenthe",
    "Flevoland",
    "Friesland",
    "Gelderland",
    "Groningen",
    "Limburg",
    "North Brabant",
    "North Holland",
    "Overijssel",
    "South Holland",
    "Utrecht",
    "Zeeland"
]

clear_jobstable("indeed_db", "jobstable")
for progLang in langlist :
    print(progLang)
    for province in provinces:
        update_jobstable_province(progLang, 4, "indeed_db", province)