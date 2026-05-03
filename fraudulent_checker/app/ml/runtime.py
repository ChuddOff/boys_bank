from app.ml.embedding_loader import load_or_create_embeddings
from sentence_transformers import SentenceTransformer

# глобальные переменные
model = None
templates = None
template_embeddings = None


def init_ml():
    global model, templates, template_embeddings

    print("🚀 Initializing ML components...")

    model = SentenceTransformer('all-MiniLM-L6-v2')

    templates, template_embeddings = load_or_create_embeddings(model)

    print("✅ ML ready")


def get_model():
    return model


def get_embeddings():
    return templates, template_embeddings
