from pydantic import BaseModel
from typing import Optional

class BookingBase(BaseModel):
    guest_id: str
    room_id: Optional[str] = None
    room_type: str = "standard"
    check_in_date: str
    check_out_date: str
    nights: int
    adults: int = 1
    children: int = 0
    source: str = "walk_in"
    room_rate: float
    special_requests: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingOut(BookingBase):
    id: str
    booking_number: str
    status: str
    total_amount: float
    paid_amount: float
    balance_amount: float

    class Config:
        from_attributes = True

class CheckInRequest(BaseModel):
    booking_id: str
    room_number: str

class CheckOutRequest(BaseModel):
    booking_id: str
