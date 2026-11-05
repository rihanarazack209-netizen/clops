from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.core.models import Room
from app.schemas.room import RoomOut, RoomCreate, RoomStatusUpdate

router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.get("/", response_model=list[RoomOut])
def list_rooms(
    status: str | None = None,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    q = db.query(Room)
    if status:
        q = q.filter(Room.status == status)
    return q.order_by(Room.room_number).all()

@router.post("/", response_model=RoomOut)
def create_room(payload: RoomCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    if db.query(Room).filter(Room.room_number == payload.room_number).first():
        raise HTTPException(400, "Room number exists")
    r = Room(**payload.model_dump(), status="available")
    db.add(r)
    db.commit()
    db.refresh(r)
    return r

@router.patch("/{room_id}/status", response_model=RoomOut)
def set_status(
    room_id: str,
    payload: RoomStatusUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(404, "Room not found")
    room.status = payload.status
    db.commit()
    db.refresh(room)
    return room