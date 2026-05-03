from app.ml.config import CONFIG
from app.ml.features.amount import amount_score
from app.ml.features.anomaly import anomaly_score
from app.ml.features.embedding import embedding_score
from app.ml.features.entropy import text_entropy
from app.ml.features.keyword import keyword_score
from app.ml.utils.explainer import explain
from app.ml.utils.math_utils import sigmoid, noise
from app.ml.utils.preprocessing import normalize_text


def final_score(raw_score):
    scaled = sigmoid(raw_score * 3 * CONFIG["aggressiveness"])
    return scaled * 100


def aggregate(features):
    w = CONFIG["weights"]

    score = (
            w["amount"] * features["amount"] +
            w["keyword"] * features["keyword"] +
            w["embedding"] * features["embedding"] +
            w["anomaly"] * features["anomaly"] +
            w["entropy"] * features["entropy"]
    )

    return score


def compute_risk(payment, model, template_embeddings):
    text = normalize_text(payment.message)

    features = {
        "amount": amount_score(payment.amount),
        "keyword": keyword_score(text),
        "embedding": embedding_score(text, template_embeddings, model),
        "anomaly": anomaly_score(text),
        "entropy": text_entropy(text),
    }

    raw = aggregate(features)
    raw += noise()

    risk = final_score(raw)

    return min(risk, 100), explain(features)
