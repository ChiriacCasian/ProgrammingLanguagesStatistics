import random
import time
from selenium.common.exceptions import TimeoutException
import concurrent.futures
from bs4 import BeautifulSoup
import requests
from itertools import cycle
from selenium import webdriver
from selenium.webdriver.common.by import By
from proxyParser import getProxies

def setupSeleniumDriver(url):
    # proxy = getAGoodProxy(False)
    # manually set proxy here if you want
    proxy = '103.174.102.127:80'
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument(f'--proxy-server={proxy}')
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(url)
    return driver

def pageManip(driver, lang):
    try:
        search_box = driver.find_element(By.ID, 'text-input-what')
        search_box.send_keys(lang)
        search_box.submit()
        time.sleep(1.88)
    except:
        print('something not found, proxy may be blocked !!')

def proxyTest(proxy, url):
    try:
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument(f'--proxy-server={proxy}')

        driver = webdriver.Chrome(options=chrome_options)
        driver.set_page_load_timeout(20)  # 10 seconds timeout for loading the page
        driver.get(url)

        search_box = driver.find_element(By.ID, 'text-input-what')

        if driver:
            return True
        return False
    except TimeoutException:
        print(f"Timeout using proxy {proxy}. Trying a different one...")
        driver.quit()  # Always close the driver on failure
        return False
    except:
        print(f"An error occurred using proxy {proxy}. Trying a different one...")
        driver.quit()
        return False

# refresh is a boolean if it is set to True the proxies will be reset otherwise
# the existing proxies will be used
# function returns a good proxy, using ThreadPoolExecutor to paralelize the process
# no need for ProccessPool since the function is I/O bound meaning it waits a lot
def getAGoodProxy(refresh):
    if refresh:
        getProxies()
    proxies = open('proxies.txt', 'r').read().split('\n')
    if(len(proxies) <= 10):
        getProxies()
        print("there are currently " + len(proxies) + " proxies")
        proxies = open('proxies.txt', 'r').read().split('\n')
    for proxy in proxies:
        if proxyTest(proxy, 'https://nl.indeed.nl') is True:
            return proxy
    return None
