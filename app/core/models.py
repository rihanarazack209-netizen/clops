import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Numeric, JSON, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class BaseModel(Base):
    __abstract__ = True
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class Room(BaseModel):
    __tablename__ = "rooms"
    room_number: Mapped[str] = mapped_column(String(10), unique=True, index=True)
    floor: Mapped[int] = mapped_column(Integer)
    type: Mapped[str] = mapped_column(String(30), default="standard")
    status: Mapped[str] = mapped_column(String(20), default="available", index=True)
    capacity: Mapped[int] = mapped_column(Integer, default=2)
    price_per_night: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    amenities: Mapped[list] = mapped_column(JSON, default=list)
    current_guest_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    current_booking_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    notes: Mapped[str | None] = mapped_column(String(500), nullable=True)

class Guest(BaseModel):
    __tablename__ = "guests"
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100), index=True)
    email: Mapped[str] = mapped_column(String(200), index=True)
    phone: Mapped[str] = mapped_column(String(50))
    nationality: Mapped[str] = mapped_column(String(60), default="Qatari")
    country: Mapped[str] = mapped_column(String(60), default="Qatar")
    government_id_type: Mapped[str] = mapped_column(String(20), default="qid")
    government_id_number: Mapped[str] = mapped_column(String(50))
    date_of_birth: Mapped[str | None] = mapped_column(String(20), nullable=True)
    vip_level: Mapped[str] = mapped_column(String(20), default="none")
    total_stays: Mapped[int] = mapped_column(Integer, default=0)
    total_spent: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    preferences: Mapped[dict | None] = mapped_column(JSON, nullable=True)

class Booking(BaseModel):
    __tablename__ = "bookings"
    booking_number: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    guest_id: Mapped[str] = mapped_column(ForeignKey("guests.id"))
    room_id: Mapped[str | None] = mapped_column(ForeignKey("rooms.id"), nullable=True)
    room_type: Mapped[str] = mapped_column(String(30), default="standard")
    check_in_date: Mapped[str] = mapped_column(String(20))
    check_out_date: Mapped[str] = mapped_column(String(20))
    nights: Mapped[int] = mapped_column(Integer, default=1)
    adults: Mapped[int] = mapped_column(Integer, default=1)
    children: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(20), default="confirmed", index=True)
    source: Mapped[str] = mapped_column(String(30), default="walk_in")
    room_rate: Mapped[float] = mapped_column(Numeric(10, 2))
    total_amount: Mapped[float] = mapped_column(Numeric(12, 2))
    paid_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    balance_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    special_requests: Mapped[str | None] = mapped_column(String(500), nullable=True)
    room = relationship("Room")
    guest = relationship("Guest")

class Folio(BaseModel):
    __tablename__ = "folios"
    booking_id: Mapped[str] = mapped_column(ForeignKey("bookings.id"), unique=True)
    guest_id: Mapped[str] = mapped_column(ForeignKey("guests.id"))
    total_charges: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    total_payments: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    balance: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    charges = relationship("FolioCharge", back_populates="folio", cascade="all, delete-orphan")
    payments = relationship("FolioPayment", back_populates="folio", cascade="all, delete-orphan")

class FolioCharge(BaseModel):
    __tablename__ = "folio_charges"
    folio_id: Mapped[str] = mapped_column(ForeignKey("folios.id"))
    window: Mapped[int] = mapped_column(Integer, default=1)
    date: Mapped[str] = mapped_column(String(20))
    description: Mapped[str] = mapped_column(String(300))
    category: Mapped[str] = mapped_column(String(30))
    amount: Mapped[float] = mapped_column(Numeric(10, 2))
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    total: Mapped[float] = mapped_column(Numeric(10, 2))
    is_void: Mapped[bool] = mapped_column(Boolean, default=False)
    void_reason: Mapped[str | None] = mapped_column(String(300), nullable=True)
    posted_by: Mapped[str] = mapped_column(String(80), default="system")
    folio = relationship("Folio", back_populates="charges")

class FolioPayment(BaseModel):
    __tablename__ = "folio_payments"
    folio_id: Mapped[str] = mapped_column(ForeignKey("folios.id"))
    date: Mapped[str] = mapped_column(String(20))
    method: Mapped[str] = mapped_column(String(30))
    amount: Mapped[float] = mapped_column(Numeric(10, 2))
    reference: Mapped[str | None] = mapped_column(String(100), nullable=True)
    posted_by: Mapped[str] = mapped_column(String(80), default="system")
    folio = relationship("Folio", back_populates="payments")

class HousekeepingTask(BaseModel):
    __tablename__ = "housekeeping_tasks"
    room_id: Mapped[str] = mapped_column(ForeignKey("rooms.id"))
    assigned_to: Mapped[str | None] = mapped_column(String(36), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    priority: Mapped[str] = mapped_column(String(20), default="normal")
    type: Mapped[str] = mapped_column(String(30), default="checkout_clean")
    notes: Mapped[str | None] = mapped_column(String(500), nullable=True)
    inspected_by: Mapped[str | None] = mapped_column(String(80), nullable=True)

class MaintenanceTicket(BaseModel):
    __tablename__ = "maintenance_tickets"
    room_id: Mapped[str | None] = mapped_column(ForeignKey("rooms.id"), nullable=True)
    category: Mapped[str] = mapped_column(String(30), default="other")
    description: Mapped[str] = mapped_column(String(500))
    priority: Mapped[str] = mapped_column(String(20), default="medium")
    status: Mapped[str] = mapped_column(String(20), default="open")
    reported_by: Mapped[str] = mapped_column(String(80), default="staff")
    assigned_to: Mapped[str | None] = mapped_column(String(36), nullable=True)
    resolution: Mapped[str | None] = mapped_column(String(500), nullable=True)

class Employee(BaseModel):
    __tablename__ = "employees"
    employee_number: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    phone: Mapped[str] = mapped_column(String(50))
    department: Mapped[str] = mapped_column(String(30))
    designation: Mapped[str] = mapped_column(String(80))
    shift: Mapped[str] = mapped_column(String(20), default="morning")
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(30), default="receptionist")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

class Attendance(BaseModel):
    __tablename__ = "attendance"
    employee_id: Mapped[str] = mapped_column(String(36), index=True)
    date: Mapped[str] = mapped_column(String(20))
    check_in: Mapped[str | None] = mapped_column(String(10), nullable=True)
    check_out: Mapped[str | None] = mapped_column(String(10), nullable=True)
    working_hours: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    status: Mapped[str] = mapped_column(String(20), default="present")

class InventoryItem(BaseModel):
    __tablename__ = "inventory_items"
    name: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(60))
    unit: Mapped[str] = mapped_column(String(20))
    current_stock: Mapped[int] = mapped_column(Integer, default=0)
    reorder_level: Mapped[int] = mapped_column(Integer, default=0)
    last_purchase_price: Mapped[float] = mapped_column(Numeric(10, 2), default=0)

class StockMovement(BaseModel):
    __tablename__ = "stock_movements"
    item_id: Mapped[str] = mapped_column(String(36), index=True)
    movement_type: Mapped[str] = mapped_column(String(20))
    quantity: Mapped[int] = mapped_column(Integer)
    reference: Mapped[str | None] = mapped_column(String(100), nullable=True)