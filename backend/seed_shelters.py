from app.database.connection import SessionLocal
from app.database import models

db = SessionLocal()
if db.query(models.Shelter).count() == 0:
    s1 = models.Shelter(name="Sector 12 Evacuation Center", latitude=19.0765, longitude=72.8770, capacity=500, current_occupancy=450)
    s2 = models.Shelter(name="Mumbai Central Relief Camp", latitude=19.0750, longitude=72.8790, capacity=1000, current_occupancy=200)
    db.add(s1)
    db.add(s2)
    db.commit()
    print("Seeded shelters.")
else:
    print("Shelters exist.")
db.close()
