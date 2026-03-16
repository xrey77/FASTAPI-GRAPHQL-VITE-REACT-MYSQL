from __future__ import annotations  
from typing import List
import strawberry
from typing import Optional
from typing import Optional, Annotated

@strawberry.type
class RoleType:
    id: int
    name: str
    users: List["UserType"]
    # users: List[Annotated["UserType", strawberry.lazy(".schema")]] 

@strawberry.type
class UserType:
    id: int
    firstname: str
    lastname: str
    email: str
    mobile: str
    username: str
    role_id: int
    isactivated: int
    isblocked: int
    mailtoken: int
    userpic: str
    secret: Optional[str] = None
    qrcodeurl: Optional[str] = None
    roles: List[RoleType] 

