"""RemoteOK API scraper."""

import requests
import logging
from typing import List, Dict, Any
from datetime import datetime

from .base import BaseScraper

logger = logging.getLogger(__name__)


class RemoteOKScraper(BaseScraper):
    """Scraper for RemoteOK.com API."""
    
    def __init__(self, session):
        super().__init__(session)
        self.source_name = "remoteok"
        self.base_url = "https://remoteok.com/api"
    
    async def scrape(self, search_query: str = "software engineer", limit: int = 50) -> List[Dict[str, Any]]:
        """Scrape job postings from RemoteOK API."""
        jobs = []
        
        try:
            logger.info(f"Scraping RemoteOK API")
            
            # RemoteOK has a public API
            response = requests.get(
                self.base_url,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                },
                timeout=30
            )
            
            if response.status_code != 200:
                logger.error(f"Failed to fetch RemoteOK API: {response.status_code}")
                return jobs
            
            data = response.json()
            
            # First item is metadata, skip it
            job_listings = data[1:limit+1]
            
            for job_data in job_listings:
                try:
                    # Extract job details
                    title = job_data.get("position", "")
                    company = job_data.get("company", "Unknown")
                    description = job_data.get("description", "")
                    
                    # Location - RemoteOK shows location tags
                    location = job_data.get("location", "Remote")
                    if not location or location == "false":
                        location = "Remote"
                    
                    city = location.split(",")[0].strip() if "," in location else location
                    
                    # Salary
                    salary_min = job_data.get("salary_min")
                    salary_max = job_data.get("salary_max")
                    
                    # Job ID
                    job_id = job_data.get("id", "")
                    
                    # URL
                    job_url = job_data.get("url", f"https://remoteok.com/remote-jobs/{job_id}")
                    
                    # Tags (often include skills and job type)
                    tags = job_data.get("tags", [])
                    
                    # Determine employment type from tags
                    employment_type = self.parse_employment_type(" ".join(tags))
                    
                    # Determine seniority
                    seniority = self.parse_seniority(title, description)
                    
                    # Remote type (RemoteOK is all remote)
                    remote_type = self.parse_remote_type("remote")
                    
                    # Extract skills from tags and description
                    skills = self.extract_skills(title, description + " " + " ".join(tags))
                    
                    # Add relevant tags as skills
                    tech_tags = [
                        tag for tag in tags 
                        if tag.lower() not in ["remote", "full-time", "contract", "freelance"]
                    ]
                    for tag in tech_tags[:5]:  # Limit to 5 tags
                        if tag.title() not in skills:
                            skills.append(tag.title())
                    
                    job_info = {
                        "external_id": str(job_id),
                        "title": title,
                        "company_name": company,
                        "location_city": city,
                        "location_country": "Remote",
                        "description": description[:1000],  # Limit description length
                        "salary_min": salary_min,
                        "salary_max": salary_max,
                        "salary_currency": "USD",
                        "salary_period": "year",
                        "employment_type": employment_type,
                        "seniority": seniority,
                        "remote_type": remote_type,
                        "url": job_url,
                        "skills": skills
                    }
                    
                    jobs.append(job_info)
                    logger.info(f"Scraped: {title} at {company}")
                    
                except Exception as e:
                    logger.error(f"Error parsing RemoteOK job: {str(e)}")
                    continue
            
            logger.info(f"Successfully scraped {len(jobs)} jobs from RemoteOK")
            
        except Exception as e:
            logger.error(f"Error scraping RemoteOK: {str(e)}")
        
        return jobs
