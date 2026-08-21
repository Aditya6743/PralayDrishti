from fastapi import WebSocket
from typing import List
import json
from datetime import datetime

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message_type: str, data: dict):
        message = {
            "type": message_type,
            "data": data
        }
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception as e:
                self.disconnect(connection)

    async def broadcast_report(self, report_data: dict):
        await self.broadcast("NEW_REPORT", report_data)

    async def broadcast_incident(self, incident_data: dict):
        await self.broadcast("INCIDENT_UPDATE", incident_data)
        
    async def broadcast_notification(self, notif_data: dict):
        await self.broadcast("NEW_NOTIFICATION", notif_data)

manager = ConnectionManager()
