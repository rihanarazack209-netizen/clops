from fastapi import APIRouter
from app.api.v1 import auth, rooms, bookings, folios, housekeeping, maintenance, employees, night_audit

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(rooms.router)
api_router.include_router(bookings.router)
api_router.include_router(folios.router)
api_router.include_router(housekeeping.router)
api_router.include_router(maintenance.router)
api_router.include_router(employees.router)
api_router.include_router(night_audit.router)
