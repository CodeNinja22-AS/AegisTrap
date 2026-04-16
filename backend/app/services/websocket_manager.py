import asyncio
import json
from typing import List
from fastapi import WebSocket

class WebSocketConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        async with self.lock:
            self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        text_data = json.dumps(message)
        async with self.lock:
            for connection in self.active_connections:
                try:
                    await connection.send_text(text_data)
                except Exception as e:
                    # Ignore failing connections (they'll be removed on disconnect)
                    pass

manager = WebSocketConnectionManager()
