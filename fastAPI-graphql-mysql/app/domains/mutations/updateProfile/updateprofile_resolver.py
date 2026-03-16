import strawberry
from strawberry.types import Info
from app.core.db import get_db
from app.domains.mutations.updateProfile.inputs import ProfileInput
from app.domains.queries.getusers.types import UserType
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from graphql import GraphQLError
from sqlalchemy import select

@strawberry.type
class UpdateProfileResponse:
    message: str

class Context:
    db: AsyncSession

async def update_profile(info: Info[Context, None], input: ProfileInput) -> UpdateProfileResponse:
    db = info.context["db"]
    
    user = db.get(User, input.id) 
    if user is None:
        raise GraphQLError(
            "User ID not found.",
            extensions={"code": "USER_ID_NOT_FOUND"}
        )

    user.firstname = input.firstname;
    user.lastname = input.lastname;
    user.mobile = input.mobile;

    db.commit()

    return UpdateProfileResponse(
        message="You have updated your profile successfully."
    )        

# =====REQUEST======
# mutation UpdateProfile($input: ProfileInput!) {
#   updateProfile(input: $input) {
#     message
#   }
# }


# ============VARIABLES=============
# {
#   "input": {
#     "firstname": "Lilian",
#     "lastname": "Hervias-Gragasin",
#     "mobile": "12345890",
#   }
# }
