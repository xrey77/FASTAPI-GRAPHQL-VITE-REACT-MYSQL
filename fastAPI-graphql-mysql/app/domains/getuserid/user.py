import strawberry
from typing import Optional
from app.domains.getusers.types import UserType, RoleType
from app.core.db import get_db
from strawberry.types import Info
from app.models.model import User

def get_userid(info: Info, id: int) -> Optional[User]:
    db = info.context["db"]    
    user = db.get(User, id) 
    return user


# ==========REQUEST================
# query GetUserId($id: Int!) {
#   user(id: $id) {    
#   	id
#     firstname
#     lastname
#     email
#     mobile
#     userpic
#     isactivated
#     isblocked
#     mailtoken
#     userpic
#     qrcodeurl
#   }
# }

# ========VARIABLES======
# {
#   "id": 1
# }