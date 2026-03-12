import strawberry
from strawberry.types import Info
from app.core.db import get_db
from app.domains.signup.inputs import CreateUserInput
from app.domains.getusers.types import UserType
from sqlalchemy.ext.asyncio import AsyncSession
# from app.core.security import get_password_hash 
from app.models.model import User
from graphql import GraphQLError
from sqlalchemy import select
from app.core.hashing import Hasher

@strawberry.type
class CreateUserResponse:
    message: str
    # user: UserType


class Context:
    db: AsyncSession

async def create_user_resolver(info: Info[Context, None], input: CreateUserInput) -> CreateUserResponse:
    db = info.context["db"]
    
    query_email = select(User).where(User.email == input.email)
    result = db.execute(query_email)
    existing_email = result.scalars().first()
    if existing_email:
        raise GraphQLError(
            "Email Address is already taken.",
            extensions={"code": "EMAIL_ALREADY_EXISTS"}
        )

    query_username = select(User).where(User.username == input.username)
    result = db.execute(query_username)
    existing_username = result.scalars().first()

    if existing_username:
        raise GraphQLError(
            "Username is already taken.",
            extensions={"code": "USERNAME_ALREADY_EXISTS"}
        )


    hashed_password = Hasher.get_password_hash(input.password)

    new_user = User(
        firstname=input.firstname,
        lastname=input.lastname,
        email=input.email,
        mobile=input.mobile,
        username=input.username,
        password=hashed_password,
        role_id=2
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return CreateUserResponse(
        message="You have registered successfully, please login now."
    )        

# =====REQUEST======
# mutation CreateUser($input: CreateUserInput!) {
#   createUser(input: $input) {
#     message
#   }
# }

# ============VARIABLES=============
# {
#   "input": {
#     "firstname": "Lilian",
#     "lastname": "Hervias-Gragasin",
#     "email": "lilian@yahoo.com",
#     "mobile": "12345890",
#     "username": "Lilian",
#     "password": "rey"
#   }
# }
