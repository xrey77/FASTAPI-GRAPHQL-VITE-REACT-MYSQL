import strawberry
from strawberry.permission import BasePermission
from typing import Any

class AllowAny(BasePermission):
    def has_permission(self, source: Any, info: strawberry.Info, **kwargs: Any) -> bool:
        return True
