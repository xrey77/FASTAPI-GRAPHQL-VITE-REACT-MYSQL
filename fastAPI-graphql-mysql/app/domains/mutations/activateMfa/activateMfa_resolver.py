import strawberry
import pyotp
import qrcode
import base64
import io
from strawberry.types import Info
from app.core.db import get_db
from app.domains.queries.getusers.types import UserType
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from graphql import GraphQLError
from sqlalchemy import select
from app.domains.mutations.activateMfa.inputs import MfaActivationInput
from typing import Optional 

@strawberry.type
class MfaActivationResponse:
    message: str
    qrcodeurl: Optional[str] 

class Context:
    db: AsyncSession

async def mfa_activation(info: Info[Context, None], input: MfaActivationInput) -> MfaActivationResponse:
    db = info.context["db"]
    
    user_model = db.get(User, input.id)         
    if not user_model:
        raise GraphQLError("User ID Not found.", extensions={"code": "USER_ID_NOT_FOUND"})

    if input.twofactorenabled:
        # 2. Generate TOTP Secret and URI
        secret = pyotp.random_base32()
        uri = pyotp.totp.TOTP(secret).provisioning_uri(
            name=user_model.email, 
            issuer_name="WINCOR-NIXDORF"
        )            

        # 3. Generate QR Code as Base64 string
        img = qrcode.make(uri)            
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        imgbase64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        b64image = "data:image/png;base64," + imgbase64; 
        user_model.secret = secret
        user_model.qrcodeurl = b64image
        qrcodeurl = b64image
        message = "Multi-Factor Authenticator enabled successfully."
    else:
        user_model.secret = None
        user_model.qrcodeurl = None
        qrcodeurl = None
        message = "Multi-Factor Authenticator disabled successfully."

    try:
        db.commit()
        return MfaActivationResponse(message=message, qrcodeurl=qrcodeurl)
    except Exception as e:
        db.rollback()
        raise GraphQLError(f"Update failed: {str(e)}")


# =====REQUEST======
# mutation MfaActivation($input: MfaActivationInput!) {
#   MfaActivationResponse(input: $input) {
#     message
#     qrcodeurl
#   }
# }

# ============VARIABLES=============
# {
#   "input": {
#     "id": 1,
#     "twofactorenabled": true
#   }
# }
