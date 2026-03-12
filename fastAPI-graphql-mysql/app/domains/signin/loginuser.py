import strawberry
from strawberry.types import Info
from sqlalchemy.future import select
from app.models.model import User
from app.domains.getusers.types import UserType
from app.domains.signin.inputs import LoginInput
# from app.core.security import get_password_hash 
from .auth import verify_password, create_access_token
from graphql import GraphQLError
from app.core.hashing import Hasher
from app.domains.getusers.types import UserType, RoleType

@strawberry.type
class LoginResponse:
    message: str
    token: str
    user: UserType

async def login_resolver(info: Info, input: LoginInput) -> LoginResponse:
    db = info.context["db"]

    result =  db.execute(select(User).where(User.username == input.username))
    user = result.scalars().first()

    if not user:
        raise GraphQLError(
            "Username not found, please try again.",
            extensions={"code": "USERNAME_NOT_FOUND"}
        )

    # print("test.................." + user.password) 
    if Hasher.verify_password(input.password, user.password):
        token = create_access_token(data={"sub": user.email})
        
        user_data = UserType(
            id=user.id,
            firstname=user.firstname,
            lastname=user.lastname,
            email=user.email,
            mobile=user.mobile,
            username=user.username,
            isactivated=user.isactivated,
            isblocked=user.isblocked,
            mailtoken=user.mailtoken,
            userpic=user.userpic,
            qrcodeurl=user.qrcodeurl,
            role_id=user.role_id,
            roles=[RoleType(id=r.id, name=r.name) for r in user.roles] 
            
        )

        return LoginResponse(
            message="You have logged-in successfully, please wait.",
            token=token,
            user=user_data
        )

    raise GraphQLError(
        "Invalid Password, please try again.",
        extensions={"code": "INVALID_PASSWORD_PLEASE_TRY_AGAIN"}
    )


# ==========REQUEST==============
# mutation LoginUser($input: LoginInput!) {  
#   loginUser(input: $input) {
#     message
#     token
#     user {
#       id
#       username
#       email
#       firstname
#       lastname
#       qrcodeurl
#     }
#   }
# }

# ==========VARIABLES=======
# {
#   "input": {
#     "username": "Rey",
#     "password": "rey"
#   }
# }
