import strawberry
from strawberry.types import Info
from app.core.db import get_db
from app.domains.queries.getusers.types import UserType
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from graphql import GraphQLError
from sqlalchemy import select
from app.core.hashing import Hasher
from app.domains.mutations.updatePassword.inputs import UpdatePasswordInput

@strawberry.type
class UpdatePasswordResponse:
    message: str

class Context:
    db: AsyncSession

async def update_password(info: Info[Context, None], input: UpdatePasswordInput) -> UpdatePasswordResponse:
    db = info.context["db"]
    
    user = db.get(User, input.id) 
    if user is None:
        raise GraphQLError(
            "User ID not found.",
            extensions={"code": "USER_ID_NOT_FOUND"}
        )

    hashed_password = Hasher.get_password_hash(input.password)
    user.password = hashed_password;

    db.commit()
    db.refresh(user) 

    return UpdatePasswordResponse(
        message="You have changed you password successfully."
    )        

# =====REQUEST======
# mutation UpdatePassword($input: UpdatePasswordInput!) {
#   UpdatePasswordResponse(input: $input) {
#     message
#   }
# }

# ============VARIABLES=============
# {
#   "input": {
#     "id": 1,
#     "password": "nald"
#   }
# }
