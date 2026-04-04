import random

# In-memory session store (resets on server restart)
sessions = {}

def get_session(session_id):
    """
    Retrieves or initializes a session for the given ID.
    Includes persistent state memory.
    """
    if session_id not in sessions:
        sessions[session_id] = {
            "history": [],
            "stage": "probing",
            "last_table_accessed": "None",
            "leaked_data": [],
            "instability_level": round(random.random(), 2)
        }
    return sessions[session_id]

def update_stage(session):
    """
    Progressively increases the simulation depth based on attempt count.
    """
    length = len(session["history"])

    if length < 2:
        session["stage"] = "probing"
    elif length < 5:
        session["stage"] = "exploitation"
    else:
        session["stage"] = "deep_access"
