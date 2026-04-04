import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

db = None
cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")

if cred_path:
    # Fallback to check parent directory if Render dumped it in root
    if not os.path.exists(cred_path) and os.path.exists(os.path.join("..", cred_path)):
        cred_path = os.path.join("..", cred_path)
        
    try:
        # Initialize Firebase Admin
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        
        # Connect to Firestore
        db = firestore.client()
        print("[DATABASE] Firebase Firestore initialized successfully.")
    except Exception as e:
        print(f"[DATABASE] Error initializing Firebase: {e}")
else:
    print("[DATABASE] WARNING: Firebase credentials file missing or path not set. Cloud logging disabled.")
