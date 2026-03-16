from __future__ import annotations  
from typing import List
import strawberry
import math
from sqlalchemy import select, func
from app.models.product import Product
from app.domains.types.productType import ProductType
from typing import Optional
from app.core.db import get_db
from strawberry.types import Info
from sqlalchemy.ext.asyncio import AsyncSession

@strawberry.type
class ProductListResponse:
    page: int
    totpage: int
    totalrecords: int
    products: List[ProductType]

class Context:
    db: AsyncSession

async def product_list(info: Info, page: int = 1) -> ProductListResponse:
    db = info.context["db"]
    per_page = 5
    offset = (page - 1) * per_page

    count_query = select(func.count()).select_from(Product)
    total_records = ( db.execute(count_query)).scalar() or 0

    if total_records == 0:
        return ProductListResponse(page=page, totpage=0, totalrecords=0, products=[])

    total_pages = math.ceil(total_records / per_page)

    items_query = select(Product).order_by(Product.id).offset(offset).limit(per_page)
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
            productpicture=item.productpicture,
            alertstocks=item.alertstocks,
            criticalstocks=item.criticalstocks
        ) for item in items
    ]

    return ProductListResponse(
        page=page,
        totpage=total_pages,
        totalrecords=total_records,
        products=product_data
    )

# =========REQUEST==============
# query ProductList($page: Int!) {
#   productList(page: $page) {    
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


# =====VARIABLES=====
# {
#     "page": 1
# }
