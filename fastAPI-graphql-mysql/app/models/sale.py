from __future__ import annotations
from datetime import datetime
from decimal import Decimal
from sqlalchemy import Numeric, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.core.db import Base

class Sale(Base):
    __tablename__ = 'sales'
    
    # Python 3.10 style: Use Mapped[] for type safety
    id: Mapped[int] = mapped_column(primary_key=True)
    saleamount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    # Using 'datetime | None' is the 3.10 way to say Optional
    saledate: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<Sale '{self.id}', '{self.saleamount}', '{self.saledate}'>"


# from __future__ import annotations  
# from sqlalchemy import Column, Integer, String, DateTime, LargeBinary, Numeric, text
# from sqlalchemy.orm import declarative_base, Mapped, mapped_column, relationship
# from sqlalchemy.sql import func
# from typing import Optional
# from app.core.db import Base


# class Sale(Base):
#     __tablename__ = 'sales'
#     id = Column(Integer, primary_key=True)
#     saleamount = Column(Numeric(10,2),nullable=False)
#     saledate = Column(DateTime(timezone=True), server_default=func.now())

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'saleamount': self.saleamount,
#             'saledate': self.saledate,
#         }

#     def __repr__(self):
#         return f"<Sale '{self.id}','{self.saleamount}','{self.saledate}'>"
