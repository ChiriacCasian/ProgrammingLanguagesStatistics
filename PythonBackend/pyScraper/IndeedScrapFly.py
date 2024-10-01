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

clear_jobstable("indeed_db", "jobstable")
clear_jobstable("indeed_db_nl", "jobstable")
update_jobstable("java", "en", 10, "indeed_db")
update_jobstable("java", "nl", 10, "indeed_db_nl")

update_jobstable("python", "nl", 10, "indeed_db_nl")
update_jobstable("python", "nl", 10, "indeed_db_nl")

update_jobstable("c++", "nl", 10, "indeed_db_nl")
update_jobstable("c++", "nl", 10, "indeed_db_nl")
