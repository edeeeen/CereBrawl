from db import db, dbModels
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager
from routers.battle.battle import router as battle_router
from routers.quizzes.quizzes import router as quizzes_router

import logging
from dotenv import load_dotenv

load_dotenv()
# Configure logging
# By default, Python's logging module sends messages to stderr.
# Azure App Services capture stdout and stderr, making them visible in the Log Stream.
logging.basicConfig(
    level=logging.INFO, # Set the desired logging level (e.g., DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Get a logger instance
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application starting")
    db.create_db_and_tables()
    logger.info("Database tables initialized")
    yield
    logger.info("Application shutting down, cleaning up")
    db.engine.dispose(close=True)
    logger.info("Database connections closed")

descript = """
"""

app = FastAPI(
    lifespan=lifespan,
    title="CereBrawl API",
    description=descript
)

# Allowed origins by CORS
origins = [
    "http://localhost:5173",
    "https://cerebrawl.me",
    "https://orange-cliff-06642ef1e.6.azurestaticapps.net/"
]

# Allow API to be used at different hosts named by origins variable
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(battle_router)
app.include_router(quizzes_router)

# Test function for the API
@app.get("/api")
def read_root():
    return {"Hello": "World"}