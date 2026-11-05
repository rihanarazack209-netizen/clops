from pydantic import BaseModel, EmailStr

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
