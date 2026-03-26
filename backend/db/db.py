import os
import logging  
from dotenv import load_dotenv
from sqlalchemy import create_engine 
from .dbModels import Base
import urllib


logger = logging.getLogger(__name__)

load_dotenv()

connection_string = os.environ.get('SQL_CONNECTION_STRING')
# check if env string is found
# Check that connection_string was found properly and make connection
if connection_string:
    # parse string for sqlalchemy
    connection_string_encoded = urllib.parse.quote_plus(connection_string)
    SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={connection_string_encoded}"
    
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        echo=True # Shows SQL statements in console
    )

    logger.info("db handler instance created")
    # Create database tables if they don't exist
    Base.metadata.create_all(bind=engine)
    logger.info("Created tables")
else:
    logger.error("No valid connection string found. Cannot establish db connection")
    raise RuntimeError("No valid db connection string found")
# Need a case where no connection string is found


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]   