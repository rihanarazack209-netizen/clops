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