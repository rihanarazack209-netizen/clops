from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.core.models import Booking
from app.schemas.booking import BookingCreate, BookingOut, CheckInRequest, CheckOutRequest
from app.services.checkin_service import check_in, check_out
from app.utils.booking_number import generate_booking_number

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.get("/", response_model=list[BookingOut])
def list_bookings(
    status: str | None = None,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    q = db.query(Booking)
    if status:
        q = q.filter(Booking.status == status)
    return q.order_by(Booking.created_at.desc()).all()

@router.post("/", response_model=BookingOut)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    total = float(payload.room_rate) * payload.nights
    b = Booking(
        **payload.model_dump(),
        booking_number=generate_booking_number(),
        status="confirmed",
        total_amount=total,
        paid_amount=0,
        balance_amount=total,
    )
    db.add(b)
    db.commit()
    db.refresh(b)
    return b

@router.post("/check-in", response_model=BookingOut)
def do_check_in(payload: CheckInRequest, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return check_in(db, payload.booking_id, payload.room_number)

@router.post("/check-out", response_model=BookingOut)
def do_check_out(payload: CheckOutRequest, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return check_out(db, payload.booking_id)
