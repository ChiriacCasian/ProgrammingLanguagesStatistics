from bs4 import BeautifulSoup
import requests

url = 'https://www.tiobe.com/tiobe-index/'

page = requests.get(url)

soup = BeautifulSoup(page.content, 'html.parser')

table = soup.find('table', id = 'top20')

headers = table.find_all('tr')

#4 is the language
#0 is the rating
#5 is the market share
#6 is the gain this month
for element in headers:
    td_elements = element.find_all('td')
    if td_elements:
        print(td_elements[4].getText())
        print(td_elements[0].getText())
        print(td_elements[5].getText())
        print(td_elements[6].getText())
        print("\n")
