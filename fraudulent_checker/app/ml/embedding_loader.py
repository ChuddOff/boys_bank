import hashlib
import json
import os

import numpy as np
from sentence_transformers import SentenceTransformer

# пути
TEMPLATE_PATH = "app/data/templates.txt"
CACHE_PATH = "app/data/embeddings_cache.json"


# 🔹 1. hash файла
def get_file_hash(path: str) -> str:
    with open(path, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()


# 🔹 2. загрузка шаблонов
def load_templates() -> list[str]:
    if not os.path.exists(TEMPLATE_PATH):
        raise FileNotFoundError(f"Templates file not found: {TEMPLATE_PATH}")

    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        templates = [line.strip() for line in f if line.strip()]

    if not templates:
        raise ValueError("templates.txt is empty")

    return templates


# 🔹 3. сохранение кэша
def save_cache(file_hash: str, templates: list[str], embeddings: np.ndarray):
    data = {
        "hash": file_hash,
        "templates": templates,
        "embeddings": np.asarray(embeddings, dtype=np.float32).tolist()
    }

    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# 🔹 4. загрузка кэша
def load_cache():
    with open(CACHE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    embeddings = np.asarray(data["embeddings"], dtype=np.float32)

    # 💣 жесткая защита
    if embeddings.ndim != 2:
        embeddings = np.stack(embeddings).astype(np.float32)

    templates = data["templates"]
    file_hash = data["hash"]

    return file_hash, templates, embeddings


# 🔥 5. ГЛАВНАЯ ФУНКЦИЯ
def load_or_create_embeddings(model: SentenceTransformer):
    current_hash = get_file_hash(TEMPLATE_PATH)

    # пробуем загрузить кэш
    if os.path.exists(CACHE_PATH):
        try:
            cached_hash, templates, embeddings = load_cache()

            if cached_hash == current_hash:
                print("✅ Using cached embeddings")
                return templates, embeddings

            else:
                print("♻️ Templates changed, recomputing embeddings...")

        except Exception as e:
            print("⚠️ Cache corrupted, recomputing...", e)

    # если нет кэша или он устарел
    print("⚡ Computing embeddings...")

    templates = load_templates()

    embeddings = model.encode(
        templates,
        convert_to_numpy=True
    )

    embeddings = np.asarray(embeddings, dtype=np.float32)

    assert embeddings.ndim == 2, embeddings.shape

    save_cache(current_hash, templates, embeddings)

    return templates, embeddings
