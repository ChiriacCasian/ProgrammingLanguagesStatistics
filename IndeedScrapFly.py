import re
import json
import sys

from scrapfly import ScrapflyClient, ScrapeConfig
from bs4 import BeautifulSoup
from scrapfly import *

scrapfly = ScrapflyClient(key="scp-live-9751df464c634d47ba47054350e0ee67")

def get_page_data(url):
    result = scrapfly.scrape(
    ScrapeConfig(
        url=url,
        asp=True,
        )
    )

    data = re.findall(r'window.mosaic.providerData\["mosaic-provider-jobcards"\]=(\{.+?\});', result.content)
    data = json.loads(data[0])
    return {
        "results": data["metaData"]["mosaicProviderJobCardsModel"]["results"],
        "meta": data["metaData"]["mosaicProviderJobCardsModel"]["tierSummaries"],
    }

def next_page(url):
    index = url.find("start=")
    if(index == -1):
        return url + "&start=0"
    index += 6
    #print(url[index])
    currentNr = ""
    while(index < len(url) and url[index].isdigit()):
        currentNr += url[index]
        index += 1
    #print(currentNr)
    intCurrentNr = int(currentNr)
    intCurrentNr += 10
    return url[:index-len(currentNr)] + str(intCurrentNr)


lang = "java"
url="https://nl.indeed.com/jobs?q="+lang+"&l=netherlands&start=0"

while(jobs := get_page_data(url)["results"]):
    for job in jobs:
        #print(job.keys())
        print(job["createDate"])
        print(job["jobLocationCity"])
        print(job["title"])
        print(job["salarySnippet"])
        print(job["jobCardRequirementsModel"])
        print('----------------------------------------\n')
    url = next_page(url)

#jobs = get_page_data(url)["results"]


    # soup = BeautifulSoup(job["jobCardContent"], 'html.parser')
    # print(soup.prettify() + '\n')