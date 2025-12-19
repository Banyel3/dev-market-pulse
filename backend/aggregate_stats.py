"""
Script to manually aggregate daily statistics.
Useful for testing or backfilling historical data.
"""

import sys
from datetime import datetime, timedelta
from sqlmodel import Session

from app.database import engine
from app.tasks import (
    aggregate_skill_stats,
    aggregate_location_stats,
    aggregate_company_stats,
    aggregate_global_stats
)


def aggregate_stats_for_date(target_date: datetime.date):
    """Aggregate statistics for a specific date."""
    print(f"\n📊 Aggregating statistics for {target_date}")
    print("=" * 60)
    
    session = Session(engine)
    
    try:
        # Aggregate skill stats
        print("\n[1/4] Aggregating skill statistics...")
        skill_count = aggregate_skill_stats(session, target_date)
        print(f"   ✅ Aggregated {skill_count} skills")
        
        # Aggregate location stats
        print("\n[2/4] Aggregating location statistics...")
        location_count = aggregate_location_stats(session, target_date)
        print(f"   ✅ Aggregated {location_count} locations")
        
        # Aggregate company stats
        print("\n[3/4] Aggregating company statistics...")
        company_count = aggregate_company_stats(session, target_date)
        print(f"   ✅ Aggregated {company_count} companies")
        
        # Aggregate global stats
        print("\n[4/4] Aggregating global statistics...")
        aggregate_global_stats(session, target_date)
        print(f"   ✅ Global stats aggregated")
        
        print("\n" + "=" * 60)
        print(f"✅ Statistics aggregation complete for {target_date}")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        session.rollback()
    finally:
        session.close()


def backfill_historical_data(days: int = 7):
    """Backfill statistics for the last N days."""
    print(f"\n📅 Backfilling statistics for last {days} days")
    print("=" * 60)
    
    today = datetime.utcnow().date()
    
    for i in range(days):
        target_date = today - timedelta(days=i)
        aggregate_stats_for_date(target_date)
        print()


if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "backfill":
            days = int(sys.argv[2]) if len(sys.argv) > 2 else 7
            backfill_historical_data(days)
        else:
            # Aggregate for specific date
            target_date = datetime.fromisoformat(sys.argv[1]).date()
            aggregate_stats_for_date(target_date)
    else:
        # Aggregate for yesterday by default
        yesterday = (datetime.utcnow() - timedelta(days=1)).date()
        aggregate_stats_for_date(yesterday)
        
        print("\n💡 Usage:")
        print("  python aggregate_stats.py                    # Yesterday's stats")
        print("  python aggregate_stats.py 2025-12-19         # Specific date")
        print("  python aggregate_stats.py backfill 7         # Last 7 days")
