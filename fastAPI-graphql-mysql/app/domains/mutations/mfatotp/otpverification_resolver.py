import strawberry
from graphql import GraphQLError
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.core.db import get_db
from strawberry.types import Info
from app.domains.mutations.mfatotp.inputs import OtpInput
import pyotp

@strawberry.type
class OtpResponse:
    message: str
    username: str

class Context:
    db: AsyncSession

async def verify_otp(info: Info[Context, None], input: OtpInput) -> OtpResponse:
        db = info.context["db"]

        user_id = input.id
        
        user_model = db.get(User, user_id) 
        
        if not user_model:
            raise GraphQLError("User ID Not found.", extensions={"code": "USER_ID_NOT_FOUND"})

        if user_model.secret is None: 
            raise GraphQLError("Multi-Factor is not yer enabled.", extensions={"code": "MFA_IS_NOT_YET_ENABLED"})

        if input.otp is not None:
            if pyotp.TOTP(user_model.secret).verify(input.otp):
                return OtpResponse(
                    message="OTP validation successfull.",
                    username=user_model.username)
            else:
                raise GraphQLError("Invalid OTP code, please try again.", extensions={"code": "INVALID_OTP_TRYAGAIN"})
        

    
# ========REQUEST===============
# mutation VerifyOtp($input: OtpInput!) {
#   OtpResponse(input: $input) {
#     message
#     username
#   }
# }


# =========VARIABLES==========
# {
#   "input": {
#     "id": 1,
#     "otp": "12345890",
#   }
# }
