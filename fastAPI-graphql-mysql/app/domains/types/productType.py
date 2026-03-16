import strawberry
from typing import Optional
from decimal import Decimal

@strawberry.type
class ProductType:
    id: strawberry.ID
    category: Optional[str]
    descriptions: str
    qty: int
    unit: str
    costprice: Decimal
    sellprice: Decimal
    saleprice: Decimal
    alertstocks: int
    criticalstocks: int
    productpicture: Optional[str]

