from datetime import date
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.core.models import Booking, Room, Folio, FolioCharge, HousekeepingTask

def check_in(db: Session, booking_id: str, room_number: str) -> Booking:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(404, "Booking not found")
    if booking.status not in ("confirmed", "pending"):
        raise HTTPException(400, f"Cannot check in booking with status {booking.status}")

    room = db.query(Room).filter(Room.room_number == room_number).first()
    if not room:
        raise HTTPException(404, "Room not found")
    if room.status not in ("available", "inspected"):
        raise HTTPException(400, f"Room {room_number} is {room.status}, cannot be assigned")

    try:
        booking.status = "checked_in"
        booking.room_id = room.id

        room.status = "occupied"
        room.current_guest_id = booking.guest_id
        room.current_booking_id = booking.id

        existing_folio = db.query(Folio).filter(Folio.booking_id == booking.id).first()
        if not existing_folio:
            folio = Folio(
                booking_id=booking.id,
                guest_id=booking.guest_id,
                total_charges=booking.total_amount,
                total_payments=booking.paid_amount,
                balance=float(booking.total_amount) - float(booking.paid_amount),
            )
            db.add(folio)
            db.flush()
            db.add(FolioCharge(
                folio_id=folio.id,
                window=1,
                date=date.today().isoformat(),
                description=f"Room Accommodation ({room.type} {room.room_number})",
                category="room",
                amount=booking.total_amount,
                quantity=1,
                total=booking.total_amount,
                posted_by="front_desk_checkin",
            ))
        db.commit()
    except Exception:
        db.rollback()
        raise

    db.refresh(booking)
    return booking

def check_out(db: Session, booking_id: str) -> Booking:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking or booking.status != "checked_in":
        raise HTTPException(400, "Booking not in checked-in state")

    try:
        booking.status = "checked_out"
        if booking.room_id:
            room = db.query(Room).filter(Room.id == booking.room_id).first()
            if room:
                room.status = "dirty"
                room.current_guest_id = None
                room.current_booking_id = None
                db.add(HousekeepingTask(
                    room_id=room.id,
                    status="pending",
                    priority="urgent",
                    type="checkout_clean",
                    notes=f"Departure clean for room {room.room_number}",
                ))
        db.commit()
    except Exception:
        db.rollback()
        raise
    db.refresh(booking)
    return booking
