import random
from datetime import datetime

def generate_booking_number() -> str:
    return f"HMS{datetime.now():%Y%m%d}{random.randint(100, 999)}"
