import math
import random

from app.ml.config import CONFIG


def sigmoid(x):
    return min(100, max(0, x * 100))


def noise():
    return random.uniform(0, CONFIG["random_noise"])
