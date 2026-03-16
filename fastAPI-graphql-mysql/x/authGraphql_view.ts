from fastapi import Request, Response, Depends
from strawberry.fastapi import GraphQLRouter
from app.services.auth import decode_token
from app.models.user import User
from sqlalchemy.future import select
from graphql import GraphQLError
from app.core.db import get_db

async def get_context(
    request: Request, 
    response: Response,
    db=Depends(get_db)
):
    auth_header = request.headers.get("Authorization")
    user = None
    
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            payload = decode_token(token)
            user_id = payload.get("sub")
            
            result = await db.execute(select(User).where(User.email == user_id))
            user = result.scalars().first()
        except Exception as e:
            raise GraphQLError(f"Token Error: {e}")

    return {
        "request": request,
        "response": response,
        "user": user,
        "db": db
    }


# async def get_context(request: Request, response: Response, db=Depends(get_db)):
#     auth_header = request.headers.get("Authorization")
#     user = None
#     auth_error = None
    
#     if auth_header and auth_header.startswith("Bearer "):
#         try:
#             token = auth_header.split(" ")[1]
#             payload = decode_token(token)
#             user_id = payload.get("sub")
            
#             result = await db.execute(select(User).where(User.email == user_id))
#             user = result.scalars().first()
#         except Exception as e:
#             # Store error instead of raising to avoid 500ing the whole app
#             auth_error = f"Token Error: {str(e)}"

#     return {
#         "request": request,
#         "user": user,
#         "db": db,
#         "auth_error": auth_error 
#     }
