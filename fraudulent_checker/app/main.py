from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.staticfiles import StaticFiles
from sentence_transformers import SentenceTransformer

from app.api.routes import router
from app.core import state
from app.core.logger import setup_logger
from app.ml.embedding_loader import load_or_create_embeddings

app = FastAPI(docs_url=None)

STATIC_DIR = "static"

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

setup_logger()

app.include_router(router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Fraud Detection API is running"}


@app.get("/docs", include_in_schema=False)
def custom_swagger():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title="Fraud API Docs",
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )


@app.on_event("startup")
def startup_event():
    global model, template_embeddings
    print("🔄 Loading ML model...")

    state.model = SentenceTransformer("all-MiniLM-L6-v2")

    templates, embeddings = load_or_create_embeddings(state.model)
    state.template_embeddings = embeddings

    print("✅ ML loaded")
