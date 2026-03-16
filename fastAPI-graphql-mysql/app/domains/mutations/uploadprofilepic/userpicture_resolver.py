import strawberry
import os
from graphql import GraphQLError
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.core.db import get_db
from strawberry.types import Info
from app.domains.mutations.uploadprofilepic.inputs import UploadInput
from werkzeug.utils import secure_filename
from pathlib import Path
from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
from strawberry.file_uploads import Upload

@strawberry.type
class UploadResponse:
    message: str
    userpic: str

class Context:
    db: AsyncSession

BASE_DIR = Path(__file__).resolve().parents[3]
UPLOAD_DIR = BASE_DIR / "static" / "users"
# UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

async def upload_picture(info: Info[Context, None], input: "UploadInput") -> UploadResponse:
    db = info.context["db"]
    user_id = str(input.id)
    file = input.file
    
    user_model = db.get(User, user_id) 
    if not user_model:
        raise GraphQLError("User ID Not found.", extensions={"code": "USER_ID_NOT_FOUND"})


    filename = secure_filename(file.filename)
    extension = Path(filename).suffix
    newfilename = "00" + user_id + extension;

    upload_path = UPLOAD_DIR / newfilename
    
    try:
        content = await input.file.read()
        with open(upload_path, "wb") as f:
            f.write(content)
    except Exception as e:
        raise GraphQLError(f"File save failed: {str(e)}")


    try:
        user_model.userpic = newfilename
        db.commit()
        return UploadResponse(
            message="You have changed your profile picture successfully.",
            userpic=newfilename)
    except Exception as e:
        db.rollback()
        raise GraphQLError(f"Update failed: {str(e)}")

# ======REQUEST=======
# mutation UploadPicture($input: UploadInput!) {
#     upload_picture(input: $input) {
#         message
#         userpic
#     }
# }

# =======VARIABLES======
# {
#     "input": {
#         "id": 1
#         "file": null
#     }
# }