from __future__ import annotations  
from typing import List
import strawberry
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry.types import Info
from graphql import GraphQLError
from app.models.sale import Sale
from app.domains.types.saleType import SaleType

async def sales(info: Info) -> List[SaleType]:
    db: AsyncSession = info.context["db"] 

    count_stmt = select(func.count()).select_from(Sale)
    result =  db.execute(count_stmt)
    total_records = result.scalar()

    if total_records == 0:
        raise GraphQLError("No record(s) found.")

    query_stmt = select(Sale)
    query_result =  db.execute(query_stmt)
    
    return query_result.scalars().all()

# =========REQUEST=============
# query GetSales {
#   sales{
#     id
#     saleamount   
#     saledate
#   }
# }