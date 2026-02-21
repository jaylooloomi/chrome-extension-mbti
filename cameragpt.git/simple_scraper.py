# simple_scraper.py

import requests
from bs4 import BeautifulSoup

def scrape_website(url):
    """
    Fetches content from a given URL and extracts the title of the page.
    """
    try:
        # Send a GET request to the URL
        response = requests.get(url)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)

        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract the title of the page
        title = soup.title.string if soup.title else "No title found"

        print(f"Successfully scraped: {url}")
        print(f"Page Title: {title}")

    except requests.exceptions.RequestException as e:
        print(f"Error during request to {url}: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    # Example usage: Replace with the URL you want to scrape
    target_url = "https://www.google.com"
    scrape_website(target_url)

    print("
To run this script, you'll need to install requests and BeautifulSoup:")
    print("pip install requests beautifulsoup4")
