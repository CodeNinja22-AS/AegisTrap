import re
from datetime import datetime

class LogProcessor:
    """
    High-Sensitivity Risk Measurement Engine.
    Transforms unstructured security logs into structured JSON for Firestore.
    """

    def __init__(self):
        self.log_patterns = {
            "error": re.compile(r'(?:\[.*?(?:ERROR|FATAL).*?\]|(?:ERROR|FATAL))[:\s]*(.*)', re.IGNORECASE),
            "warn": re.compile(r'(?:\[.*?(?:WARN|WARNING).*?\]|(?:WARNING|WARN))[:\s]*(.*)', re.IGNORECASE),
            "debug": re.compile(r'(?:\[.*?(?:DEBUG|INFO|NOTICE).*?\]|(?:DEBUG|INFO|NOTICE))[:\s]*(.*)', re.IGNORECASE),
            "critical": re.compile(r'(?:\[.*?(?:CRITICAL|PANIC|EMERGENCY|ALERT).*?\]|(?:CRITICAL|PANIC|EMERGENCY|ALERT))[:\s]*(.*)', re.IGNORECASE)
        }
        
        self.memory_pattern = re.compile(r'0x[a-fA-F0-9]+')
        self.ip_pattern = re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b')
        self.endpoint_pattern = re.compile(r'/(?:api|v1|users|admin|search|upload|download)/[a-zA-Z0-9_/.-]*')

    def process_log(self, log_entry: dict) -> dict:
        raw_response = log_entry.get("response", "")
        raw_input = log_entry.get("input", "")
        attack_type = log_entry.get("attack_type", "unknown")
        
        lines = self._deduplicate_lines(raw_response)
        
        errors = self._extract_matching_lines(lines, self.log_patterns["error"])
        warnings = self._extract_matching_lines(lines, self.log_patterns["warn"])
        debug_logs = self._extract_matching_lines(lines, self.log_patterns["debug"])
        critical_logs = self._extract_matching_lines(lines, self.log_patterns["critical"])
        
        all_errors = critical_logs + errors
        status = self._detect_status(lines, attack_type)
        severity = self._detect_severity(attack_type, critical_logs, errors)
        security_flags = self._detect_security_flags(raw_response, attack_type)
        
        memory_indicators = sorted(list(set(self.memory_pattern.findall(raw_response))))
        network_activity = self._extract_network_activity(raw_response, lines)
        
        exploit_attempts = self._detect_exploit_attempts(raw_input, attack_type)
        exfiltration = self._detect_exfiltration(raw_response, attack_type)

        structured_log = {
            "attack_type": attack_type,
            "input_payload": raw_input,
            "severity_level": severity,
            "status": status,
            "errors": all_errors,
            "warnings": warnings,
            "debug_logs": debug_logs,
            "security_flags": security_flags,
            "memory_indicators": memory_indicators,
            "network_activity": network_activity,
            "exploit_attempts": exploit_attempts,
            "data_exfiltration_attempts": exfiltration,
            "timestamp": log_entry.get("timestamp", datetime.utcnow().isoformat()),
            "metadata": log_entry.get("metadata", {})
        }
        
        metadata = log_entry.get("metadata", {})
        structured_log["session_id"] = log_entry.get("session_id") or metadata.get("session_id", "unknown")
        structured_log["stage"] = log_entry.get("stage") or metadata.get("stage", "probing")
        
        # 🔥 FINAL STEP: Generate clean forensic resolution for UI
        forensic_indicators = security_flags + exploit_attempts + exfiltration
        structured_log["forensic_resolution"] = self._create_forensic_resolution(log_entry, forensic_indicators, severity)
        
        return structured_log

    def _create_forensic_resolution(self, raw_log: dict, forensic_indicators: list, severity: str) -> str:
        """
        Creates a clean, professional forensic resolution string for UI display.
        """
        res = [
            "$ [SYSTEM_BOOT_SEQUENCE] Connection Established.",
            f"$ date: {datetime.now().strftime('%a %b %d %H:%M:%S %Y')}",
            f"$ [RESOLVED] {raw_log.get('attack_type', 'unknown').upper()} activity intercepted.",
            f"$ Payload: {raw_log.get('input', '')}"
        ]
        
        if forensic_indicators:
            res.append(f"$ Indicators: {', '.join(forensic_indicators[:2])}")
            
        resp = raw_log.get('response', '')
        if resp:
            # Cleanly split by $ if present, otherwise split lines
            clean_lines = resp.split("$") if "$" in resp else resp.splitlines()
            for line in clean_lines[:4]: # Limit to 4 relevant lines
                if line.strip(): res.append(f"$ {line.strip()}")
            
        res.append("$ status: 200 OK (IDS Monitoring Active)")
        return "\n".join(res)

    def _deduplicate_lines(self, text: str) -> list:
        if not text: return []
        lines = text.split('\n')
        seen = set(); clean_lines = []
        for line in lines:
            line = line.strip()
            if line and line not in seen:
                clean_lines.append(line); seen.add(line)
        return clean_lines

    def _extract_matching_lines(self, lines: list, pattern: re.Pattern) -> list:
        matches = []
        for line in lines:
            m = pattern.search(line)
            if m:
                val = m.group(1).strip() if m.groups() else line
                val = re.sub(r'^[\]\s:]+|[\[\s:]+$', '', val)
                if val: matches.append(val)
        return matches

    def _detect_status(self, lines: list, attack_type: str) -> str:
        all_text = " ".join(lines).lower()
        if any(kw in all_text for kw in ["forbidden", "denied", "blocked", "rejected"]): return "blocked"
        if any(kw in all_text for kw in ["panic", "exception", "failed", "error 500"]): return "failed"
        if any(kw in all_text for kw in ["sanitized", "mitigated", "cleaned"]): return "mitigated"
        if any(kw in all_text for kw in ["success", "select", "uid=", "root:x:"]): return "executed"
        return "monitored"

    def _detect_severity(self, attack_type: str, critical: list, errors: list) -> str:
        if critical or attack_type in ["ddos_pattern", "rce", "command_injection"]: return "critical"
        if errors or attack_type in ["sqli", "xss", "jwt_attack"]: return "high"
        if attack_type in ["bruteforce", "path_traversal"]: return "medium"
        return "low"

    def _detect_security_flags(self, response: str, attack_type: str) -> list:
        flags = []
        resp_lower = response.lower()
        if "csp" in resp_lower or "content-security-policy" in resp_lower: flags.append("CSP_VIOLATION")
        if "cookie" in resp_lower or "jwt" in resp_lower: flags.append("SESSION_EXPOSURE")
        if "sql" in resp_lower or attack_type == "sqli": flags.append("SQL_TRACE")
        if "script" in resp_lower or attack_type == "xss": flags.append("XSS_PAYLOAD_EXECUTION")
        if "0x" in response: flags.append("MEMORY_ANOMALY")
        if "root" in resp_lower or "uid=0" in resp_lower: flags.append("PRIVILEGE_ESCALATION_ATTEMPT")
        return list(set(flags))

    def _extract_network_activity(self, response: str, lines: list) -> list:
        activity = []
        ips = self.ip_pattern.findall(response)
        endpoints = self.endpoint_pattern.findall(response)
        for ip in ips: activity.append({"method": "CONNECT", "endpoint": ip, "payload": "outbound connection detected"})
        for ep in endpoints: activity.append({"method": "ACCESS", "endpoint": ep, "payload": "internal path access"})
        return activity

    def _detect_exploit_attempts(self, input_text: str, attack_type: str) -> list:
        attempts = []
        if not input_text: return []
        low_input = input_text.lower()
        if "union select" in low_input or "1=1" in low_input: attempts.append("SQL_BYPASS_ATTEMPT")
        if "<script" in low_input or "onerror=" in low_input: attempts.append("XSS_INJECTION")
        if "../" in low_input: attempts.append("PATH_TRAVERSAL_PROBE")
        return attempts

    def _detect_exfiltration(self, response: str, attack_type: str) -> list:
        exfil = []
        resp_lower = response.lower()
        if "$2y$" in response: exfil.append("CREDENTIAL_LEAK")
        if "root:x:0:0" in resp_lower: exfil.append("SYSTEM_FILE_READ")
        return exfil

processor = LogProcessor()
