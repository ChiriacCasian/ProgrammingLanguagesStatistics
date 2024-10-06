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
provinces0 = [
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
provinces1 = [
    "Baden-Wurttemberg",
    "Bavaria",
    "Berlin",
    "Brandenburg",
    "Bremen",
    "Hamburg",
    "Hesse",
    "Lower-Saxony",
    "Mecklenburg-Vorpommern",
    "North-Rhine-Westphalia",
    "Rhineland-Palatinate",
    "Saarland",
    "Saxony",
    "Saxony-Anhalt",
    "Schleswig-Holstein",
    "Thuringia"
]
provinces2 = [
    "Andorra",
    "Austria",
    "Belarus",
    "Belgium",
    "Bosnia-and-Herzegovina",
    "Bulgaria",
    "Croatia",
    "Czech-Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Iceland",
    "Ireland",
    "Italy",
    "Latvia",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Moldova",
    "Monaco",
    "Montenegro",
    "Netherlands",
    "North-Macedonia",
    "Norway",
    "Poland",
    "Portugal",
    "Romania",
    "Russia",
    "San Marino",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "Switzerland",
    "Ukraine",
    "United-Kingdom",
    "Vatican-City",
    "America"
]

# clear_jobstable("indeed_db", "jobstable")
for progLang in langlist :
    print(progLang)
    # for province in provinces0:
    #     update_jobstable_province(progLang, 4, "indeed_db", province, "nl")
    for province in provinces1:
        update_jobstable_province(progLang, 4, "indeed_db", province, "de")
