from __future__ import annotations  
from typing import List
import strawberry
from app.core.db import get_db
from strawberry.types import Info
from typing import Optional
from app.domains.types.productType import ProductType
from app.models.product import Product

@strawberry.type
class CategoryType:
    id: int
    category: Optional[str] = strawberry.field(resolver=lambda self: self.name) 

    @strawberry.field
    def products(self, info: Info) -> List[ProductType]:
        db = info.context["db"] 
        return db.query(Product).filter(Product.category_id == self.id).all()


