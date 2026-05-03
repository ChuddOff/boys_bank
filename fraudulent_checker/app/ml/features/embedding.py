import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def embedding_score(message, template_embeddings, model):
    msg_emb = model.encode([message], convert_to_numpy=True).astype(np.float32)

    # 💣 защита от мусора
    template_embeddings = np.asarray(template_embeddings)

    if isinstance(template_embeddings, tuple):
        template_embeddings = template_embeddings[-1]

    if template_embeddings.ndim != 2:
        raise ValueError(f"Bad embeddings shape: {template_embeddings.shape}")

    sims = cosine_similarity(msg_emb, template_embeddings)[0]

    max_sim = sims.max()
    mean_sim = sims.mean()
    top_k = np.mean(np.sort(sims)[-3:])

    score = (1 - max_sim) * 0.7 + (1 - mean_sim) * 0.3
    return min(score, 1.0)
