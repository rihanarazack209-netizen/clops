from pydantic import BaseModel
from typing import Optional, List

class RoomBase(BaseModel):
    room_number: str
    floor: int
    type: str
    capacity: int = 2
    price_per_night: float
    amenities: List[str] = []

class RoomCreate(RoomBase):
    pass

class RoomOut(RoomBase):
    id: str
    status: str
    current_guest_id: Optional[str] = None
    current_booking_id: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class RoomStatusUpdate(BaseModel):
    status: str
