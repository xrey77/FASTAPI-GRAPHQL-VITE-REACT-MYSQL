from __future__ import annotations
from sqlalchemy.types import String, Integer, Text, Numeric
from sqlalchemy import Column, func, Integer, String, Float, ForeignKey, Text, DateTime, TIMESTAMP
from sqlalchemy.orm import declarative_base, Mapped, mapped_column, relationship
from typing import Optional
from app.core.db import Base
from sqlalchemy import Table, Column, String, Integer, ForeignKey


class Product(Base):
    __tablename__ = "products"    
    id = Column(Integer, primary_key=True, index=True)    
    category_id = Column(Integer, ForeignKey("categories.id"))    
    category_rel = relationship("Category", back_populates="products")
    category = Column(String(100))
    descriptions = Column(String(100), unique=True, index=True)
    qty = Column(Integer, server_default="0", nullable=True)
    unit = Column(String(20))    
    costprice = Column(Numeric(precision=10, scale=2), server_default="0.00") 
    sellprice = Column(Numeric(precision=10, scale=2), server_default="0.00") 
    saleprice = Column(Numeric(precision=10, scale=2), server_default="0.00")    
    productpicture = Column(String(100))
    alertstocks = Column(Integer, server_default="0", nullable=True)
    criticalstocks = Column(Integer, server_default="0", nullable=True)
    created_at =Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())