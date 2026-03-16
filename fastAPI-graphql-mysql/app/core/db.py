import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from fastapi import Depends
from typing import Generator
from sqlalchemy.orm import declarative_base

load_dotenv() 

engine = create_engine(os.getenv("SQLALCHEMY_DATABASE_URL"), connect_args={"connect_timeout": 30}, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
    
def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

