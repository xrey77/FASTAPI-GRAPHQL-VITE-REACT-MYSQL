from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from graphql import GraphQLError

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def decode_token(token: str):
    try:
        return jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])        
    except jwt.ExpiredSignatureError:
        raise GraphQLError(f"Token has expired.")
    except jwt.InvalidTokenError:
        raise GraphQLError(f"Invalid Token.")
