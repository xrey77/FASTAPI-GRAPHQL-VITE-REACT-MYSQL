import strawberry
from decimal import Decimal
from datetime import datetime 

@strawberry.type
class SaleType:
    id: strawberry.ID
    saleamount: Decimal
    saledate: datetime | None


# import strawberry
# from typing import Optional

# @strawberry.type
# class SaleType:
#     id: strawberry.ID
#     saleamount: Decimal
#     saledate: datetime


