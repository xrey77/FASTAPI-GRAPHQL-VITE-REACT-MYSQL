import os
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
# from app.core.security import decode_token
load_dotenv()

# Configuration - move these to a .env
SECRET_KEY = os.getenv('JWT_SECRET')
ALGORITHM =  os.getenv('JWT_ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@staticmethod
def create_access_token(data: dict, expires_delta: Optional[timedelta]=None):
    to_encode = data.copy()
    if expires_delta:        
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=float(ACCESS_TOKEN_EXPIRE_MINUTES))
    
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@staticmethod
def verify_jwt(token: str):
    try:
        decode_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        current_timestamp = datetime.utcnow().timestamp()
        if not decode_token:
            raise ValueError("Invalid token!")
        elif decode_token["exp"] <= current_timestamp:
            raise ValueError("Token expired!")
        return True
    except ValueError as error:
        print(error)
        return False


# @staticmethod
# def verify_jwt(token: str):
#     try:
#         decode_token = jwt.decode(token, SECRET_KEY, algorithm=[ALGORITHM])
#         current_timestamp = datetime.utcnow().timestamp()
#         if not decode_token:
#             raise ValueError("Invalid token.")
#         elif decode_token["exp"] < current_timestamp:
#             raise ValueError("Token expired.")
#     except ValueError as error:
#         print(error)
#         return False

