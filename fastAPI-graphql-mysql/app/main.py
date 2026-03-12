# run : uvicorn app.main:app --reload
import uvicorn
import os
from fastapi import FastAPI, Request, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.responses import RedirectResponse
from starlette.middleware.cors import CORSMiddleware

#GrapQL

from strawberry.fastapi import GraphQLRouter
from app.graphql.schema import schema

# for templates
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

# from app.routers import login
# from app.routers import register
# from app.routers import users
# from app.routers import products

# AUTO CREATE TABLES
from contextlib import asynccontextmanager
import asyncio
from app.core.db import Base, engine, get_db
from app.models.model import User
from app.models.model import Product
from sqlalchemy import create_engine, MetaData

def create_all_tables():
    Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_all_tables()
    yield
        
async def get_context(db=Depends(get_db)):
    return {
        "db": db,
    }

# GraphQL
graphql_app = GraphQLRouter(
    schema,
    context_getter=get_context
)

app = FastAPI(lifespan=lifespan)
app.include_router(graphql_app, prefix="/graphql")

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def serve_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/images/{image}")
async def serve_image(image: str) -> dict:
    img = "static/images/"+image
    return FileResponse(img)

@app.get("/users/{image}")
async def serve_image(image: str) -> dict:
    img = "static/users/"+image
    return FileResponse(img)
                
@app.get("/products/{image}")
async def serve_image(image: str) -> dict:
    img = "static/products/"+image
    return FileResponse(img)

# app.include_router(login.router)
# app.include_router(register.router)
# app.include_router(users.router)
# app.include_router(products.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


