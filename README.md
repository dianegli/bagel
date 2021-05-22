# Where are the NYC Bagels? 🥯

Ever wonder how many bagel shops are in your neighborhood? Look no further! To further evaluate the question, we scraped bagel shop data (review count, address, rating, etc) from Yelp on February 5, 2021. The longitude and latitude was estimated using a Google API. And using the longitude and latitude, we used the [FCC Area API](https://geo.fcc.gov/api/census/) to assign each bagel shop to a census tract. The census tract was then crosswalked into a NYC [Neigborhood Tabulation Area (NTA)](https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-nynta.page).



