import os
import logging  
from dotenv import load_dotenv
from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine
import urllib
from typing import Annotated

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]   

logger = logging.getLogger(__name__)

load_dotenv()

connection_string = os.environ.get('SQL_CONNECTION_STRING')
# check if env string is found
# Check that connection_string was found properly and make connection
if connection_string:
    # parse string for sqlalchemy
    connection_string_encoded = urllib.parse.quote_plus(connection_string)
    SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={connection_string_encoded}"

    connect_args = {"check_same_thread": False}
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args=connect_args,
        echo=True,
        pool_pre_ping=True,
        pool_recycle=3600,

        pool_timeout=60,
    )

    logger.info("db handler instance created")
else:
    logger.error("No valid connection string found. Cannot establish db connection")
    raise RuntimeError("No valid db connection string found")
# Need a case where no connection string is found



