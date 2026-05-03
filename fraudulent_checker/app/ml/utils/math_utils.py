import math
import random

from app.ml.config import CONFIG


def sigmoid(x):
    return 1 / (1 + math.exp(-x))


def noise():
    return random.uniform(0, CONFIG["random_noise"])
