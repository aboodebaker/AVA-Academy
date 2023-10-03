import requests
from bs4 import BeautifulSoup

# Define the URL of the website you want to scrape
url = "https://www.ebucks.com/web/shop/categorySelected.do?catId=1986770766"  # Replace with the actual website URL

# Send an HTTP GET request to the URL
response = requests.get(url)

# Check if the request was successful (status code 200)
if response.status_code == 200:
    # Parse the HTML content of the page using BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find the div element with class "productbox-name"
    product_name_element = soup.find_all('div', class_='productbox-name')
    print(product_name_element)
    
else:
    print("Failed to retrieve the webpage. Status code:", response.status_code)
