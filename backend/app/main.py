from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import attack, logs, analysis, insights, settings, activity_route

app = FastAPI(title="AegisTrap Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(attack.router)
app.include_router(logs.router)
app.include_router(analysis.router)
app.include_router(insights.router)
app.include_router(settings.router)
app.include_router(activity_route.router)

@app.get("/")
def root():
    return {"message": "AegisTrap Backend Running"}
