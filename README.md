# 🛡️ AegisTrap: The Agentic Cyber-Deception Shield

```text
 █████╗ ███████╗ ██████╗ ██╗███████╗████████╗██████╗  █████╗ ██████╗ 
██╔══██╗██╔════╝██╔════╝ ██║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗
███████║█████╗  ██║  ███╗██║███████╗   ██║   ██████╔╝███████║██████╔╝
██╔══██║██╔══╝  ██║   ██║██║╚════██║   ██║   ██╔══██╗██╔══██║██╔═══╝ 
██║  ██║███████╗╚██████╔╝██║███████║   ██║   ██║  ██║██║  ██║██║     
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     
                                                                      
[ AGENTIC HONEYPOT AS A SERVICE | LLM-DRIVEN DECEPTION | SOC INTEL ]
```

[![AegisTrap Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge&logo=shield-halved)](file:///c:/Users/Abhrant Singh/Desktop/Projects/Hackathon Projects/AegisTrap/AegisTrap/README.md)
[![AI Engine](https://img.shields.io/badge/AI-Mistral--7B-blueviolet?style=for-the-badge&logo=ai)](file:///c:/Users/Abhrant Singh/Desktop/Projects/Hackathon Projects/AegisTrap/AegisTrap/README.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🛠️ Sector 0: Tactical Manifest & Prerequisites

Before initiating the Aegis Initiative, ensure your local environment is equipped with the following tactical components:

| Layer | Requirement | Tactical Command |
| :--- | :--- | :--- |
| **System** | Python 3.9+, Node.js 18+ | `python --version` \| `node -v` |
| **Backend** | FastAPI, Flask, ML Stack | `pip install -r requirements.txt` |
| **Frontend** | React 19, Vite, Recharts | `npm install` |
| **Secrets** | Hugging Face Token, SMTP | Edit `backend/.env` |

---

## 🌌 The Aegis Initiative: Deceptive Defense

**AegisTrap** is a next-generation Cybersecurity Operations Center (SOC) intelligence platform that shifts the paradigm from "Passive Defense" to **"Active Deception"**. 

Traditional honeypots are static and easily fingerprinted. AegisTrap evolves this concept by deploying **Agentic Interceptors**—distributed nodes powered by Large Language Models (LLMs)—that hallucinate complex, stateful, and seemingly vulnerable infrastructures. 

> [!IMPORTANT]
> **Mission Objective**: Exhaust attacker resources, capture high-fidelity threat intelligence, and provide zero-risk environments for live attack analysis.

---

## ⚡ Tactical Intelligence Dashboard

| Vector | AegisTrap Capability | Attacker Payload | Deceptive Response |
| :--- | :--- | :--- | :--- |
| **SQLi** | Dynamic Schema Hallucination | `' OR 1=1 --` | `mysql> SELECT * FROM users...` (Fake hashes) |
| **Cmd Injection** | Sandboxed Virtual Shell | `; cat /etc/shadow` | `root:x:0:0:root:/root:/bin/bash...` |
| **LFI/RFI** | Infinite Directory Recursion | `../../etc/passwd` | Hallucinated sensitive file content |
| **API Abuse** | AI-Driven Priority Scoring | Rate limiting probe | `{"error": {"code": 429, "message": "Too Many..."}}` |

---
---

## ⚙️ Sector 2: System Capabilities

### 🧠 Agentic Deception (Powered by Mistral-7B)
Unlike traditional responses, AegisTrap uses LLMs to generate **non-linear responses**. If an attacker tries to inject SQL, the AI hallucinates a database schema and "leaks" fake data to keep them digging. If they try a Shell injection, they find themselves in a sandboxed, hallucinated terminal.

### 🌪️ The Chaos Engine
Simulate real-world complexity. The project features a dynamic **Instability Factor** that injects system noise, memory address leaks (0x...), and mock connection drops to mimic a failing, high-value target.

### 🕸️ Distributed Wraith Nodes
Multi-node interceptors (Flask-based) that can be spun up across any network. Every probe is forwarded to the **Aegis Core** for AI-driven classification and response strategy.

### ⏲️ IST-Aware Intelligence
Full synchronization with India Standard Time (IST) for precision logging, shift management, and SOC operations.

---

## 🏗️ Sector 3: Hyper-Architecture

```mermaid
graph TD
    subgraph Frontend_Layer["FRONTEND (REACT)"]
        FE[Dashboard, Simulator, Logs, Insights]
    end

    subgraph Gateway["API GATEWAY (FASTAPI)"]
        GW[/Attack, Logs, Analysis, Settings/]
    end

    subgraph Processing_Core["CORE ENGINES"]
        ML[ML LAYER: Classification & Control]
        PE[PAYLOAD ENGINE: Mutation & Noise]
        SE[SESSION ENGINE: Context & Memory]
    end

    subgraph Deception_Hub["AI DECEPTION"]
        LLM[LLM ENGINE: MISTRAL-7B]
        MC[MODE CONTROL: IDS/IPS]
    end

    subgraph Ops_Intelligence["LOGS & INTEL"]
        LOG[LOGGING: EVENT STORE]
        AI[ANALYST INTELLIGENCE]
        AUTO[AUTOMATION: EMAIL/ALERTS]
    end

    subgraph Data_Analytics["DATA & VIZ"]
        DS[DATA & STORAGE LAYER]
        VZ[VISUALIZATION + ANALYTICS]
    end

    FE --> GW
    GW --> ML
    GW --> PE
    GW --> SE
    
    ML --> LLM
    PE --> LLM
    SE --> LLM
    
    MC --> LLM
    MC --> LOG
    LLM --> LOG
    
    LOG --> AI
    AI --> AUTO
    
    LOG --> DS
    AI --> DS
    AUTO --> DS
    DS --> VZ
```

---

## 🛠️ Sector 4: Tactical Deployment

### 🛰️ Core Infrastructure (Backend)
1. **Ignite the Brain**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. **Configure Neural Access**:
   Create a `.env` in `backend/` with your tokens:
   ```env
   HF_TOKEN=your_huggingface_token
   SENDER_EMAIL=alerts@aegistrap.com
   EMAIL_PASSWORD=secure_password
   ```
3. **Launch Sequence**:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

### 🛰️ Interface Activation (Frontend)
1. **Initialize Systems**:
   ```bash
   cd frontend
   npm install
   ```
2. **Stabilize UI**:
   ```bash
   npm run dev
   ```

### 🛰️ Trap Deployment (Wraith Node)
1. **Activate Interceptor**:
   ```bash
   python backend/agentic_honeypots/http_trap.py
   ```

---

## 📊 Sector 5: Operations Interface (SOC)

The AegisTrap Dashboard provides:
- **Live Threat Feed**: Real-time visualization of incoming intercepts.
- **Payload Analysis**: Automated classification of SQLi, XSS, and LFI.
- **Analyst Rotations**: Management of on-duty security staff.
- **System Insights**: AI-generated reports on attacker behavior patterns.

---

## 🤝 Sector 6: Defense Collaborative

We welcome contributions to the Aegis Initiative.
- **Attack Flavors**: Define new deception templates in `backend/app/services/attack_flavor.py`.
- **UI Enhancements**: Modernizing the React dashboard using Framer Motion.

---

<p align="center">
  <b>Built for Hackers, by Defenders.</b><br>
  <i>AegisTrap - Where every probe is a ghost.</i>
</p>
