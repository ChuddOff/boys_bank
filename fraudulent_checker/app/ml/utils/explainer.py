def explain(features):
    return ", ".join(f"{k}:{round(v, 2)}" for k, v in features.items())
