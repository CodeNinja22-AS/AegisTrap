import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

import os

# Load dataset
dataset_path = os.path.join(os.path.dirname(__file__), "dataset.csv")
data = pd.read_csv(dataset_path, encoding='utf-8')

X = data["input"]
y = data["label"]

# Convert text to numeric features
vectorizer = CountVectorizer()
X_vec = vectorizer.fit_transform(X)

# Train model
model = LogisticRegression()
model.fit(X_vec, y)

# Save model
model_dir = os.path.join(os.path.dirname(__file__), "../../app/models")
os.makedirs(model_dir, exist_ok=True)

pickle.dump(model, open(os.path.join(model_dir, "model.pkl"), "wb"))
pickle.dump(vectorizer, open(os.path.join(model_dir, "vectorizer.pkl"), "wb"))

print("Model trained successfully!")