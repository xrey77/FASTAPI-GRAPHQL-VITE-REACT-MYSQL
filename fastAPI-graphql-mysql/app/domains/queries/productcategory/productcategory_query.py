from __future__ import annotations  
from typing import List
import strawberry
from app.core.db import get_db
from strawberry.types import Info
from app.domains.types.productType import ProductType
from app.domains.types.categoryType import CategoryType
from app.models.product import Product
from app.models.category import Category

@strawberry.type
class CategoryQuery:
    @strawberry.field
    def categories(self, info: Info) -> List[CategoryType]:
        db = info.context["db"] 
        return db.query(Category).all()

    @strawberry.field
    def products(self, info: Info) -> List[ProductType]:
        db = info.context["db"] 
        return db.query(Product).all()

# ==========REQUEST===========
# query {
#   categoryList {
#     category
#     products {
#       id
#       descriptions
#       qty
#       unit
#       costprice
#       sellprice
#       saleprice
#       productpicture
#       alertstocks
#       criticalstocks
#     }
#   }
# }
