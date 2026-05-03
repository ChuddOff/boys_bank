KEYWORDS = {
    "срочно": 0.3,
    "долг": 0.2,
    "верни": 0.2,
    "крипта": 0.5,
    "обнал": 0.6,
    "переведи": 0.2,
    "быстро": 0.1
}


def keyword_score(text):
    score = 0
    for word, weight in KEYWORDS.items():
        if word in text:
            score += weight
    return min(score, 1.0)
