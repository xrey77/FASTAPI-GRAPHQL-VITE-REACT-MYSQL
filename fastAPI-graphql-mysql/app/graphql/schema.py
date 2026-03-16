from __future__ import annotations  
from typing import List
import strawberry
from app.domains.queries.getusers.allusers import UserQuery
from app.domains.queries.getuserid.user import get_userid
from app.domains.queries.getusers.types import UserType 

from app.domains.types.saleType import SaleType
from app.domains.queries.salesdata.sales_query import sales

from app.domains.types.categoryType import CategoryType
from app.domains.queries.productcategory.productcategory_query import CategoryQuery

from app.domains.types.productType import ProductType
from app.domains.queries.getproducts.product_query import ProductQuery

from app.domains.queries.productList.listproducts_query import ProductListResponse
from app.domains.queries.productList.listproducts_query import product_list

from app.domains.queries.productSearch.searchproduct_query import ProductSearchResponse
from app.domains.queries.productSearch.searchproduct_query import product_search

from app.domains.mutations.signup.createuser import create_user_resolver
from app.domains.mutations.signup.createuser import CreateUserResponse

from app.domains.mutations.signin.loginuser import login_resolver
from app.domains.mutations.signin.loginuser import LoginResponse

from app.domains.mutations.updateProfile.updateprofile_resolver import update_profile
from app.domains.mutations.updateProfile.updateprofile_resolver import UpdateProfileResponse

from app.domains.mutations.updatePassword.password_resolver import UpdatePasswordResponse
from app.domains.mutations.updatePassword.password_resolver import update_password

from app.domains.mutations.activateMfa.activateMfa_resolver import MfaActivationResponse
from app.domains.mutations.activateMfa.activateMfa_resolver import mfa_activation


from app.domains.mutations.mfatotp.otpverification_resolver import OtpResponse
from app.domains.mutations.mfatotp.otpverification_resolver import verify_otp
from app.domains.mutations.uploadprofilepic.userpicture_resolver import UploadResponse
from app.domains.mutations.uploadprofilepic.userpicture_resolver import upload_picture

@strawberry.type
class Query:
   users: List[UserType] = strawberry.field(resolver=UserQuery.get_users)
   user: UserType = strawberry.field(resolver=get_userid)
   product_list: ProductListResponse = strawberry.field(resolver=product_list)
   product_search: ProductSearchResponse = strawberry.field(resolver=product_search)
   sales: List[SaleType] = strawberry.field(resolver=sales)
   category_list: List[CategoryType] = strawberry.field(resolver=CategoryQuery.categories)
   products: List[ProductType] = strawberry.field(resolver=ProductQuery.products)

@strawberry.type
class Mutation:
   create_user: CreateUserResponse = strawberry.mutation(resolver=create_user_resolver)
   login_user: LoginResponse = strawberry.mutation(resolver=login_resolver)
   update_profile: UpdateProfileResponse = strawberry.mutation(resolver=update_profile)
   update_password = UpdatePasswordResponse = strawberry.mutation(resolver=update_password)
   mfa_activation = MfaActivationResponse = strawberry.mutation(resolver=mfa_activation)
   verify_otp = OtpResponse = strawberry.mutation(resolver=verify_otp )
   uplodd_picture = UploadResponse = strawberry.mutation(resolver=upload_picture)
   
schema = strawberry.Schema(query=Query, mutation=Mutation)
