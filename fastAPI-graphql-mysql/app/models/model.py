from __future__ import annotations
from sqlalchemy.types import String, Integer, Text, Numeric
from sqlalchemy import Column, func, Integer, String, Float, ForeignKey, Text, DateTime, TIMESTAMP
from sqlalchemy.orm import declarative_base, Mapped, mapped_column, relationship
from typing import Optional, List
from app.core.db import Base
from sqlalchemy import Table, Column, String, Integer, ForeignKey

user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id"), primary_key=True),
)

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50))

    users: Mapped[List["User"]] = relationship(
        secondary=user_roles, back_populates="roles"
    )    

class User(Base):
    __tablename__ = "users"    
    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String(20))
    lastname = Column(String(20))
    email = Column(String(255), unique=True, index=True)
    mobile = Column(String(20))
    username = Column(String(20), unique=True, index=True)
    password = Column(String(255))
    role_id = Column(Integer, server_default="0")
    isactivated = Column(Integer, server_default="1", nullable=True)
    isblocked = Column(Integer, server_default="0", nullable=True)
    mailtoken = Column(Integer, server_default="0", nullable=True)
    secret = Column(Text())
    qrcodeurl = Column(Text())
    userpic = Column(String(100), server_default="pix.png")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    roles: Mapped[List["Role"]] = relationship(
        secondary=user_roles, back_populates="users"
    )

class Product(Base):
    __tablename__ = "products"    
    id = Column(Integer, primary_key=True, index=True)    
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