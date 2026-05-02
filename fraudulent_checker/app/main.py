from app.api.routes import router
from app.core.logger import setup_logger
from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html

app = FastAPI(
    title="Fraud Detection API",
    description="API for detecting suspicious transactions",
    version="1.0.0",
    docs_url=None
)

setup_logger()

app.include_router(router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Fraud Detection API is running"}


@app.get("/docs", include_in_schema=False)
def custom_swagger():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title="Fraud API Docs"
    )
