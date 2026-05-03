def anomaly_score(text):
    score = 0

    if len(text) < 4:
        score += 0.3

    if text.isupper():
        score += 0.2

    if "!!!" in text:
        score += 0.2

    if any(char.isdigit() for char in text):
        score += 0.1

    return min(score, 1.0)
