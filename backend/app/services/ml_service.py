import pickle
import os

# Get base directory
base_dir = os.path.dirname(os.path.dirname(__file__))

# Load model and vectorizer
model_path = os.path.join(base_dir, "models", "model.pkl")
vectorizer_path = os.path.join(base_dir, "models", "vectorizer.pkl")

# We use exception handling in case the path is incorrect during startup
try:
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    with open(vectorizer_path, "rb") as f:
        vectorizer = pickle.load(f)
except FileNotFoundError as e:
    print(f"Error loading models: {e}")
    model = None
    vectorizer = None

def predict_attack(input_text):
    if model is None or vectorizer is None:
        return "error_no_model", 0.0
        
    text_vec = vectorizer.transform([input_text])
    prediction = model.predict(text_vec)[0]
    
    # 🔹 Get confidence if possible
    try:
        conf_scores = model.predict_proba(text_vec)[0]
        confidence = max(conf_scores)
    except:
        confidence = 0.95 # Fallback to high confidence if proba is unavailable

    return prediction.lower(), confidence
    
# End of ML Service - Updated models
# Hot-reload triggered
