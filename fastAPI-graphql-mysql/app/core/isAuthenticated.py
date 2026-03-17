import strawberry
from strawberry.permission import BasePermission
from strawberry.types import Info
import typing
from typing import Any, Union
from fastapi import Request, WebSocket
from graphql import GraphQLError
from app.core.JWTManager import verify_jwt

class IsAuthenticated(BasePermission):
    message = "User is not Authenticated"

    def has_permission(self, source: typing.Any, info: Info, **kwargs) -> bool:
        request = info.context["request"]
        # Access headers authentication
        authentication = request.headers["Authorization"]
        if authentication:
            token = authentication.split("Bearer ")[-1]
            return verify_jwt(token)
        return False


# class IsAuthenticated(BasePermission):
#     message = "Unauthorized Access!"

#     async def has_permission(self, source: Any, info: Info, **kwargs) -> bool:    
#         # Ensure context exists and contains the request
#         request: Union[Request, WebSocket, None] = info.context.get("request")
        
#         if not request:
#             return False

#         # Check for Authorization header (standard) or authentication (fallback)
#         auth_header = request.headers.get("Authorization") or request.headers.get("authentication")
        
#         if auth_header and auth_header.startswith("Bearer "):
#             try:
#                 token = auth_header.split(" ")[1]
#                 # Assuming JWTManager returns a user object or True/False
#                 return JWTManager.verify_jwt(token)
#             except Exception:
#                 return False
        
#         return False



# class IsAuthenticated(BasePermission):
#     message = "Un-Authorized Access!"
#     async def has_permission(self, source, info: Info, **kwargs) -> bool:
#         request = info.context["request"]
#         #Access Headers Authentiation
#         authentiation = request.headers["Authorization"]
#         if authentication:
#             token = authentiation.split("Bearer ")[-1]
#             return JWTManager.verify_jwt(token)
#         return False

# class IsAuthenticated(BasePermission):
#     message = "User is not authenticated"

#     def has_permission(self, source: Any, info: Info, **kwargs) -> bool:
#         # Access the FastAPI request from the context
#         request: Union[Request, WebSocket] = info.context["request"]
#         print("request....................")
#         authentiation = request.headers["authentication"]
#         if authentication:
#             print("token.....................")
#             token = authentiation.split("Bearer ")[-1]
#             return JWTManager.verify_jwt(token)


#         # Implement your authentication logic (e.g., check headers or session)
#         user = request.scope.get("user")
#         if user and user.is_authenticated:
#             return True
#         return False

