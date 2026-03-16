from __future__ import annotations  
from typing import List
import strawberry
import math
from sqlalchemy import select, func, or_
from app.models.product import Product
from typing import Optional
from app.core.db import get_db
from strawberry.types import Info
from app.domains.types.productType import ProductType
from graphql import GraphQLError
from sqlalchemy.ext.asyncio import AsyncSession

@strawberry.type
class ProductSearchResponse:
    page: int
    totpage: int
    totalrecords: int
    products: List[ProductType]

class Context:
    db: AsyncSession


async def product_search(info: Info, keyword: str, page: int = 1) -> ProductSearchResponse:
    db = info.context["db"] 

    per_page = 5        
    search_term = f"%{keyword.lower()}%"

    queryCnt =  db.query(func.count()).select_from(Product)    

    total_records = queryCnt.where(or_(Product.descriptions.ilike(search_term))).scalar()
    if total_records == 0:
        raise GraphQLError(f"No record(s) found.")


    total_pages = math.ceil(total_records / per_page)    

    items_query = select(Product).where(Product.descriptions.ilike(search_term))
    result =  db.execute(items_query)
    items = result.scalars().all()

    product_data = [
        ProductType(
            id=item.id, 
            category=item.category, 
            descriptions=item.descriptions,
            qty=item.qty,
            unit=item.unit,
            costprice=item.costprice,
            sellprice=item.sellprice,
            saleprice=item.saleprice,
            alertstocks=item.alertstocks,
            productpicture=item.productpicture,
            criticalstocks=item.criticalstocks
        ) for item in items
    ]

    return ProductSearchResponse(
        page=page,
        totpage=total_pages,
        totalrecords=total_records,
        products=product_data
    )

# =====REQUEST======
# query ProductSearch($keyword: String!, $page: Int!) {
#   productSearch(keyword: $keyword, page: $page) {    
#     page
#     totpage
#     totalrecords
#     products {
#       id
#       category
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

# ====VARIABLES====
# {
#   	"keyword": "cineo",
#     "page": 1
# }
