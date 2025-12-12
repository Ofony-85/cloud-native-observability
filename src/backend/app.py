"""Main FastAPI application."""
import os
import socket
from datetime import datetime
from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST

from config import settings
from database import get_db, init_db, Item as DBItem

# Prometheus metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    ['method', 'endpoint']
)

# Pydantic models
class ItemCreate(BaseModel):
    """Model for creating an item."""
    name: str
    description: str = None

class ItemResponse(BaseModel):
    """Model for item response."""
    id: int
    name: str
    description: str = None
    created_at: datetime

    class Config:
        from_attributes = True

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API with monitoring and database integration"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    init_db()

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@app.get("/api/info")
async def get_info():
    """Get application info."""
    return {
        "app_name": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "hostname": socket.gethostname(),
        "database": {
            "host": settings.db_host,
            "port": settings.db_port,
            "database": settings.db_name
        },
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@app.get("/api/items", response_model=List[ItemResponse])
async def get_items(db: Session = Depends(get_db)):
    """Get all items from database."""
    items = db.query(DBItem).all()
    return items

@app.post("/api/items", response_model=ItemResponse)
async def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    """Create a new item in the database."""
    db_item = DBItem(name=item.name, description=item.description)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint."""
    return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
