import strawberry
from typing import List
from app.domains.getusers.users import get_users
from app.domains.getuserid.user import get_userid
from app.domains.getusers.types import UserType 
from app.domains.signup.createuser import create_user_resolver
from app.domains.signin.loginuser import login_resolver
from app.domains.signup.createuser import CreateUserResponse
from app.domains.signin.loginuser import LoginResponse

@strawberry.type
class Query:
   users: List[UserType] = strawberry.field(resolver=get_users)
   user: UserType = strawberry.field(resolver=get_userid)

@strawberry.type
class Mutation:
   create_user: CreateUserResponse = strawberry.mutation(resolver=create_user_resolver)
   login_user: LoginResponse = strawberry.mutation(resolver=login_resolver)

schema = strawberry.Schema(query=Query, mutation=Mutation)
