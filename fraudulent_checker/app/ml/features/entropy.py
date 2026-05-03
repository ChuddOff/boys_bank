import math
from collections import Counter


def text_entropy(text):
    counts = Counter(text)
    total = len(text)

    entropy = 0
    for c in counts.values():
        p = c / total
        entropy -= p * math.log2(p)

    # нормализация
    return min(entropy / 5, 1.0)
