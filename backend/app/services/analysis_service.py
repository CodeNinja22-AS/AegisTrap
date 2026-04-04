def generate_analyst_summary(activity_log):
    """
    Generates a high-level summary of analyst performance.
    """
    summary = {
        "total_attacks": len(activity_log),
        "sqli": 0,
        "xss": 0,
        "api_abuse": 0,
        "brute_force": 0,
        "other": 0
    }

    for entry in activity_log:
        at_type = entry.get("attack_type", "other").lower()
        if at_type in summary:
            summary[at_type] += 1
        else:
            summary["other"] += 1

    return summary
