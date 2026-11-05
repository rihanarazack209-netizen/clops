from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.models import Employee, Room, Booking, Guest
from app.core.security import verify_password, create_access_token, hash_password, get_current_user
from app.schemas import (
    TokenResponse, UserOut, EmployeeCreate, EmployeeOut, 
    RoomCreate, RoomOut, RoomStatusUpdate, 
    BookingCreate, BookingOut, GuestCreate, GuestOut
)
from datetime import datetime
import random

api_router = APIRouter()

# ================= AUTH =================
@api_router.post("/auth/login", response_model=TokenResponse, tags=["auth"])
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Employee).filter(Employee.email == form.username).first()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")
    return TokenResponse(access_token=create_access_token(user.id), user=UserOut.model_validate(user))

@api_router.get("/auth/me", response_model=UserOut, tags=["auth"])
def me(current=Depends(get_current_user)): 
    return UserOut.model_validate(current)

# ================= EMPLOYEES =================
@api_router.post("/employees/", response_model=EmployeeOut, tags=["employees"])
def create_employee(payload: EmployeeCreate, db: Session = Depends(get_db)):
    if db.query(Employee).filter(Employee.email == payload.email).first(): 
        raise HTTPException(400, "Email already exists")
    emp = Employee(**payload.model_dump(exclude={"password"}), password_hash=hash_password(payload.password))
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp

@api_router.get("/employees/", response_model=list[EmployeeOut], tags=["employees"])
def list_employees(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Employee).all()

# ================= ROOMS =================
@api_router.get("/rooms/", response_model=list[RoomOut], tags=["rooms"])
def list_rooms(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Room).all()

@api_router.post("/rooms/", response_model=RoomOut, tags=["rooms"])
def create_room(payload: RoomCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    room = Room(**payload.model_dump(), status="available")
    db.add(room)
    db.commit()
    db.refresh(room)
    return room

@api_router.patch("/rooms/{room_id}/status", response_model=RoomOut, tags=["rooms"])
def set_status(room_id: str, payload: RoomStatusUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room: 
        raise HTTPException(404, "Room not found")
    room.status = payload.status
    db.commit()
    db.refresh(room)
    return room

# ================= GUESTS =================
@api_router.post("/guests/", response_model=GuestOut, tags=["guests"])
def create_guest(payload: GuestCreate, db: Session = Depends(get_db)):
    # Removed auth check here so the frontend reservation form works smoothly
    guest = Guest(**payload.model_dump())
    db.add(guest)
    db.commit()
    db.refresh(guest)
    return guest

@api_router.get("/guests/", response_model=list[GuestOut], tags=["guests"])
def list_guests(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Guest).all()

# ================= BOOKINGS =================
@api_router.post("/bookings/", response_model=BookingOut, tags=["bookings"])
def create_booking(payload: BookingCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    total = float(payload.room_rate) * payload.nights
    booking_number = f"HMS{datetime.now():%Y%m%d}{random.randint(100, 999)}"
    
    new_booking = Booking(
        **payload.model_dump(),
        booking_number=booking_number,
        status="confirmed",
        total_amount=total,
        paid_amount=0,
        balance_amount=total
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

@api_router.get("/bookings/", response_model=list[BookingOut], tags=["bookings"])
def list_bookings(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Booking).all()

# ================= CHECK-IN / CHECK-OUT =================
@api_router.post("/bookings/check-in", response_model=BookingOut, tags=["bookings"])
def do_check_in(payload: dict, db: Session = Depends(get_db), _=Depends(get_current_user)):
    from app.services.checkin_service import check_in
    return check_in(db, payload["booking_id"], payload["room_number"])

@api_router.post("/bookings/check-out", response_model=BookingOut, tags=["bookings"])
def do_check_out(payload: dict, db: Session = Depends(get_db), _=Depends(get_current_user)):
    from app.services.checkin_service import check_out
    return check_out(db, payload["booking_id"])