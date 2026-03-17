from fastapi import Depends
from strawberry.fastapi import BaseContext
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import db  # Assuming db has your get_db method

class CustomContext(BaseContext):
    def __init__(self, db: AsyncSession):
        super().__init__()
        self.db = db

async def get_context(db: AsyncSession = Depends(db.get_db)) -> CustomContext:
    return CustomContext(db=db)

