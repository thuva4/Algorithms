import math

def fibonacci_golden_ratio(num):
    """Returns fibonacci numbers using the Golden Ratio formula"""

    golden_ratio = (1 + math.sqrt(5)) / 2
    
    golden_ratio_conjugate = (1 - math.sqrt(5)) / 2

    return int(round(
        ((golden_ratio ** num)
        - (golden_ratio_conjugate ** num))
        / math.sqrt(5)))
