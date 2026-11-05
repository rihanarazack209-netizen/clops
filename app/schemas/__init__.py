from pydantic import BaseModel, EmailStr
from typing import Optional, List

# ================= AUTH =================
class UserOut(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    role: str
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# ================= EMPLOYEES =================
class EmployeeCreate(BaseModel):
    employee_number: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    department: str
    designation: str
    shift: str = "morning"
    password: str
    role: str = "receptionist"

class EmployeeOut(BaseModel):
    id: str
    employee_number: str
    first_name: str
    last_name: str
    email: str
    phone: str
    department: str
    designation: str
    shift: str
    role: str
    is_active: bool
    class Config:
        from_attributes = True

# ================= ROOMS =================
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

# ================= GUESTS =================
class GuestCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    nationality: str = "Qatari"
    country: str = "Qatar"
    government_id_type: str = "qid"
    government_id_number: str
    vip_level: str = "none"

class GuestOut(GuestCreate):
    id: str
    total_stays: int = 0
    total_spent: float = 0
    class Config:
        from_attributes = True

# ================= BOOKINGS =================
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

# ================= MISC =================
class CheckInRequest(BaseModel):
    booking_id: str
    room_number: str

class CheckOutRequest(BaseModel):
    booking_id: str