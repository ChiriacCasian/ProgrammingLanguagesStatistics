from bs4 import BeautifulSoup
import requests

def getProxies():
    page = requests.get('https://free-proxy-list.net/')
    soup = BeautifulSoup(page.content, 'html.parser')
    table = soup.find('table', class_ = 'table table-striped table-bordered')
    headers = table.find_all('tr')
    file = open('proxies.txt', 'w')

    for element in headers:
        tds = element.find_all('td')
        if(len(tds) >= 1):
            file.write(tds[0].getText() + ":" + tds[1].getText() + '\n')

getProxies()
