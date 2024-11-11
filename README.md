<div align="center">
<pre>
    ____          _                     _        _          
  / ___|___   __| | ___ _ __ ___   ___| |_ _ __(_) ___ ___ 
 | |   / _ \ / _` |/ _ \ '_ ` _ \ / _ \ __| '__| |/ __/ __|
 | |__| (_) | (_| |  __/ | | | | |  __/ |_| |  | | (__\__ \
  \____\___/ \__,_|\___|_| |_| |_|\___|\__|_|  |_|\___|___/
                                                                                                        </pre>
</div>

[//]: # (https://patorjk.com/software/taag/#p=display&f=Ivrit&t=Commi%20tScheduler)
http://codemetrics.info
[![Demonstration](https://img.youtube.com/vi/mosv04ryBvM/maxresdefault.jpg)](https://youtu.be/mosv04ryBvM)

## Features
- a list of programming languages each with a median salary, number of listings and number of new listings this week
- each progamming language has nl/de/usa specific data and list can be sorted by listings/salary/custom ranking coefficient but also by country
- for each country interactive svg map that provides data on province specific salary/listings
- easy functionality for adding new countries in the frontend, just provide the new SVG for the new country and communication endpoints to the backend

### Purpose
Code metrics is a IT market analysis tool that uses a scraper to gather data about the current state of the job market and
compiles it into an easily interpretable UI, its scope is to inform users about market trends and to provide live information such as current salaries for different programming lanugages and current market demand indicators.
### Implementation
The frontend is implemented in React, the scraping is done by a python scraper using scrapFly and the data manipulation is done in Java, all data is stored in a MySql database SpringBoot and React servers are hosted locally.
### To Do 
    - certifications for https connection for the React server too (already done for the SpringBoot Server)
    - language switch for nl/de/en
    - refactoring some of the frontend to be more manageable and split into more classes
    - better layout for mobile users

