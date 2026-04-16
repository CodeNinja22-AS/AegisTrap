from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket_manager import manager

router = APIRouter()

@router.websocket("/ws/threats")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # We don't expect the client to send anything, 
            # but we need to receive to keep the connection alive
            # and handle disconnects correctly.
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
