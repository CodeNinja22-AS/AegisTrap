def decide_action(prediction):
    if prediction == "sqli":
        return "fake_db"
    elif prediction == "bruteforce":
        return "slow_response"
    elif prediction == "xss":
        return "filter_bypass_simulate"
    elif prediction == "command_injection":
        return "fake_shell_output"
    elif prediction == "path_traversal":
        return "fake_file_system"
    elif prediction == "file_upload_attack":
        return "fake_upload"
    elif prediction == "ddos_pattern":
        return "slow_response_ddos"
    elif prediction == "csrf":
        return "fake_transaction"
    elif prediction == "jwt_attack":
        return "fake_auth_success"
    elif prediction == "api_abuse":
        return "rate_limit_simulation"
    elif prediction == "suspicious":
        return "monitor"
    else:
        return "normal"
