from __future__ import annotations  
from typing import List
import strawberry
from sqlalchemy import select, func
from app.models.product import Product
from app.core.db import get_db
from strawberry.types import Info
from app.domains.types.productType import ProductType
from graphql import GraphQLError

@strawberry.type
class ProductQuery:
    @strawberry.field
    def products(self, info: Info) -> List[ProductType]:
        db = info.context["db"] 

        count_stmt = select(func.count()).select_from(Product)
        result =  db.execute(count_stmt)
        total_records = result.scalar()
        if total_records == 0:
            raise GraphQLError(f"No record(s) found.")

        query_stmt = select(Product)
        query_result =  db.execute(query_stmt)
        
        return query_result.scalars().all()

# =========REQUEST=============
# query GetProducts {
#   products{
#     id
#     descriptions
#     qty
#     unit
#     costprice
#     sellprice
#     saleprice
#     productpicture
#     alertstocks
#     criticalstocks
#   }
# }