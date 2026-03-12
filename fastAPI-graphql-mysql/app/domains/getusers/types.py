import strawberry
from typing import Optional
from typing import Optional, List, Annotated

@strawberry.type
class RoleType:
    id: int
    name: str

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
    userpic: Optional[str] = None
    secret: Optional[str] = None
    qrcodeurl: Optional[str] = None
    roles: List[RoleType] 
