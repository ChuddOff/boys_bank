import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def embedding_score(message, template_embeddings, model):
    msg_emb = model.encode([message])

    sims = cosine_similarity(msg_emb, template_embeddings)[0]

    max_sim = np.max(sims)
    mean_sim = np.mean(sims)
    top_k = np.mean(sorted(sims)[-3:]) if len(sims) >= 3 else max_sim

    # сложная комбинация
    score = (
            0.5 * max_sim +
            0.3 * top_k +
            0.2 * mean_sim
    )

    return min(float(score), 1.0)
