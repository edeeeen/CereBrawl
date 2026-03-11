from fastapi import FastAPI
import logging
from contextlib import asynccontextmanager

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
    logger.error("Application starting")
    yield
    logger.error("Application shutting down, cleaning up")

descript = """
*CereBrawl*
"""

app = FastAPI(
    lifespan=lifespan,
    description=descript
)

# Test function for the API
@app.get("/api")
def read_root():
    return {"Hello": "World"}