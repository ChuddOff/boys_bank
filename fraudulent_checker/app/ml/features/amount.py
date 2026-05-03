import math


def amount_score(amount):
    return min(math.log1p(amount) / 10, 1.0)
