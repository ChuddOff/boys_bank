import numpy as np


def amount_score(amount):
    return min(1.0, np.log10(amount + 1) / 5)
