def get_mode_behavior(mode):
    """
    Returns behavioral instructions for the security layer.
    """
    if mode == "IDS":
        return {
            "name": "Intrusion Detection (Monitor)",
            "deception": True,
            "block": False,
            "log": True,
            "directive": "Continue deception. System is vulnerable and leaking data. Encourage further interaction."
        }
    elif mode == "IPS":
        return {
            "name": "Intrusion Prevention (Active Block)",
            "deception": False,
            "block": True,
            "log": True,
            "directive": "System is hardened. Reject malicious input. Simulate total blocking behavior."
        }
    
    return get_mode_behavior("IDS") # Default to IDS
