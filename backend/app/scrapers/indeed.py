"""Indeed job scraper using Playwright."""

import asyncio
import re
from typing import List, Dict, Any
from playwright.async_api import async_playwright, Page
import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class IndeedScraper(BaseScraper):
    """Scraper for Indeed.com job postings."""
    
    def __init__(self, session):
        super().__init__(session)
        self.source_name = "indeed"
        self.base_url = "https://www.indeed.com"
    
    async def scrape(self, search_query: str = "software engineer", limit: int = 50) -> List[Dict[str, Any]]:
        """Scrape job postings from Indeed."""
        jobs = []
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            )
            page = await context.new_page()
            
            try:
                # Search for jobs
                search_url = f"{self.base_url}/jobs?q={search_query.replace(' ', '+')}&l=United+States"
                logger.info(f"Scraping Indeed: {search_url}")
                
                await page.goto(search_url, wait_until="domcontentloaded", timeout=30000)
                await page.wait_for_timeout(2000)
                
                # Extract job cards
                job_cards = await page.locator(".job_seen_beacon, .jobsearch-ResultsList > li").all()
                logger.info(f"Found {len(job_cards)} job cards")
                
                for i, card in enumerate(job_cards[:limit]):
                    try:
                        # Extract basic info
                        title_elem = card.locator("h2.jobTitle, .jobTitle")
                        title = await title_elem.inner_text() if await title_elem.count() > 0 else None
                        
                        if not title:
                            continue
                        
                        company_elem = card.locator("[data-testid='company-name'], .companyName")
                        company = await company_elem.inner_text() if await company_elem.count() > 0 else "Unknown"
                        
                        location_elem = card.locator("[data-testid='text-location'], .companyLocation")
                        location = await location_elem.inner_text() if await location_elem.count() > 0 else "Remote"
                        
                        # Parse location
                        city = location.split(",")[0].strip() if "," in location else location
                        
                        # Get job link
                        link_elem = card.locator("h2.jobTitle a, .jobTitle a")
                        job_link = await link_elem.get_attribute("href") if await link_elem.count() > 0 else None
                        
                        if job_link and not job_link.startswith("http"):
                            job_link = self.base_url + job_link
                        
                        # Extract job ID from link
                        job_id = None
                        if job_link:
                            match = re.search(r"jk=([a-zA-Z0-9]+)", job_link)
                            if match:
                                job_id = match.group(1)
                        
                        # Get salary if available
                        salary_elem = card.locator(".salary-snippet, [data-testid='attribute_snippet_testid']")
                        salary_text = await salary_elem.inner_text() if await salary_elem.count() > 0 else None
                        
                        salary_min, salary_max = self.parse_salary(salary_text)
                        
                        # Get job type
                        job_type_elem = card.locator(".metadata, .job-snippet")
                        job_type_text = await job_type_elem.inner_text() if await job_type_elem.count() > 0 else ""
                        
                        # Extract description snippet
                        desc_elem = card.locator(".job-snippet, [data-testid='job-snippet']")
                        description = await desc_elem.inner_text() if await desc_elem.count() > 0 else ""
                        
                        employment_type = self.parse_employment_type(job_type_text + " " + description)
                        seniority = self.parse_seniority(title, description)
                        remote_type = self.parse_remote_type(location + " " + description)
                        
                        # Extract skills
                        skills = self.extract_skills(title, description)
                        
                        job_data = {
                            "external_id": job_id or f"indeed_{i}",
                            "title": title.strip(),
                            "company_name": company.strip(),
                            "location_city": city,
                            "location_country": "USA",
                            "description": description.strip(),
                            "salary_min": salary_min,
                            "salary_max": salary_max,
                            "salary_currency": "USD",
                            "salary_period": "year",
                            "employment_type": employment_type,
                            "seniority": seniority,
                            "remote_type": remote_type,
                            "url": job_link,
                            "skills": skills
                        }
                        
                        jobs.append(job_data)
                        logger.info(f"Scraped: {title} at {company}")
                        
                    except Exception as e:
                        logger.error(f"Error scraping job card: {str(e)}")
                        continue
                
            except Exception as e:
                logger.error(f"Error scraping Indeed: {str(e)}")
            finally:
                await browser.close()
        
        return jobs
    
    def parse_salary(self, salary_text: str) -> tuple[float | None, float | None]:
        """Parse salary from text."""
        if not salary_text:
            return None, None
        
        # Look for salary ranges like "$80,000 - $120,000 a year"
        match = re.search(r'\$?([\d,]+)(?:\s*-\s*\$?([\d,]+))?', salary_text)
        if match:
            min_sal = float(match.group(1).replace(',', ''))
            max_sal = float(match.group(2).replace(',', '')) if match.group(2) else min_sal
            
            # Convert hourly to yearly
            if 'hour' in salary_text.lower():
                min_sal *= 2080  # 40 hours * 52 weeks
                max_sal *= 2080
            
            return min_sal, max_sal
        
        return None, None
