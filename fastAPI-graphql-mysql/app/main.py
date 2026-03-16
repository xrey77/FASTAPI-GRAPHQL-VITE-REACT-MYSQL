# run : uvicorn app.main:app --reload
import uvicorn
import os
from dotenv import load_dotenv
#Auth Guard
from fastapi import Request, Response, Depends
from app.core.security import decode_token

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

# AUTO CREATE TABLES
from contextlib import asynccontextmanager
import asyncio
from app.core.db import Base, engine, get_db
from app.models.user import User
from app.models.product import Product
from app.models.sale import Sale
from app.models.category import Category
from sqlalchemy import create_engine, MetaData

from pathlib import Path

load_dotenv() 
BASE_DIR = Path(__file__).resolve().parent
def create_all_tables():
    Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_all_tables()
    yield
        
async def get_context(db=Depends(get_db)):
    return {"db": db}


# GraphQL
graphql_app = GraphQLRouter(
    schema, 
    context_getter=get_context, 
    multipart_uploads_enabled=True
)

app = FastAPI(lifespan=lifespan)

origins = ['http://localhost:5173', 'http://127.0.0.1:5173']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
# app.mount("/static", StaticFiles(directory="static"), name="static")

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

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

async def get_context(
    request: Request, 
    response: Response, 
    db=Depends(get_db)
):
    auth_header = request.headers.get("Authorization")
    user = None
    auth_error = None
    
    if auth_header and auth_header.startswith("Bearer "):
        try:
            token = auth_header.split(" ")[1]
            payload = decode_token(token)
            user_id = payload.get("sub")
            
            result = await db.execute(select(User).where(User.email == user_id))
            user = result.scalars().first()
        except Exception as e:
            auth_error = f"Token Error: {str(e)}"

    return {
        "request": request,
        "response": response,
        "user": user,
        "db": db,
        "auth_error": auth_error 
    }

graphql_app = GraphQLRouter(
    schema,
    context_getter=get_context
)

app.include_router(graphql_app,prefix="/graphql")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


