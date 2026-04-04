def get_threshold_config(level):
    """
    Returns the required confidence score for an attack classification.
    """
    thresholds = {
        "paranoid": 0.4, # Very sensitive
        "balanced": 0.75, # Balanced (Default)
        "strict": 0.95 # Highly targeted
    }
    
    return thresholds.get(level.lower(), thresholds["balanced"])
