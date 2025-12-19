"""Web scrapers for job boards."""

from .base import BaseScraper
from .indeed import IndeedScraper
from .remoteok import RemoteOKScraper

__all__ = ["BaseScraper", "IndeedScraper", "RemoteOKScraper"]
