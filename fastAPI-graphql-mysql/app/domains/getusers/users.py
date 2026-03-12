from __future__ import annotations
import strawberry
from typing import List
from app.core.db import get_db
from strawberry.types import Info
from app.models.model import User
from app.domains.getusers.types import UserType, RoleType

def get_users(info: Info) -> List[UserType]:
    db = info.context["db"] 
    
    user_records = db.query(User).all() 
    
    return [
        UserType(
            id=u.id,
            firstname=u.firstname,
            lastname=u.lastname,
            email=u.email,
            mobile=u.mobile,
            username=u.username,
            role_id=u.role_id,
            isactivated=u.isactivated,
            isblocked=u.isblocked,
            mailtoken=u.mailtoken,
            userpic=u.userpic,
            secret=u.secret,
            qrcodeurl=u.qrcodeurl,
            roles=[RoleType(id=r.id, name=r.name) for r in u.roles] 
        ) for u in user_records
    ]

# ========REQUEST=============
# query GetUsers {
#   users {
#     id
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
#     roleId
#   }
# }