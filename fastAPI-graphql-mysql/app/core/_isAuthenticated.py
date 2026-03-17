import strawberry
from strawberry.permission import BasePermission
from strawberry.types import Info

class IsAuthenticated(BasePermission):
    message = "Un-Authorized Access!"

    def has_permission(self, source, info: Info, **kwargs) -> bool:
        return info.context.get("user") is not None
