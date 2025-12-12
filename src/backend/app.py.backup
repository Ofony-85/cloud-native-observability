"""Main FastAPI application."""
import os
import socket
from datetime import datetime
from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import PlainTextResponse
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

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Run on application startup."""
    init_db()
    print(f"✅ Database initialized")
    print(f"✅ Application started: {settings.app_name} v{settings.app_version}")
    print(f"✅ Environment: {settings.environment}")
    print(f"✅ Database: {settings.db_host}:{settings.db_port}/{settings.db_name}")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    REQUEST_COUNT.labels(method='GET', endpoint='/health', status='200').inc()
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "timestamp": datetime.utcnow().isoformat()
    }

# Readiness check (includes database)
@app.get("/ready")
async def readiness_check(db: Session = Depends(get_db)):
    """Readiness check including database."""
    try:
        # Test database connection
        db.execute("SELECT 1")
        REQUEST_COUNT.labels(method='GET', endpoint='/ready', status='200').inc()
        return {
            "status": "ready",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        REQUEST_COUNT.labels(method='GET', endpoint='/ready', status='500').inc()
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

# Prometheus metrics endpoint
@app.get("/metrics", response_class=PlainTextResponse)
async def metrics():
    """Prometheus metrics endpoint."""
    return generate_latest()

# Server info endpoint
@app.get("/api/info")
async def get_info():
    """Get server information."""
    REQUEST_COUNT.labels(method='GET', endpoint='/api/info', status='200').inc()
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
        "timestamp": datetime.utcnow().isoformat()
    }

# Get all items
@app.get("/api/items", response_model=List[ItemResponse])
async def get_items(db: Session = Depends(get_db)):
    """Get all items from database."""
    with REQUEST_LATENCY.labels(method='GET', endpoint='/api/items').time():
        items = db.query(DBItem).all()
        REQUEST_COUNT.labels(method='GET', endpoint='/api/items', status='200').inc()
        return items

# Create item
@app.post("/api/items", response_model=ItemResponse, status_code=201)
async def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    """Create a new item in database."""
    with REQUEST_LATENCY.labels(method='POST', endpoint='/api/items').time():
        db_item = DBItem(name=item.name, description=item.description)
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        REQUEST_COUNT.labels(method='POST', endpoint='/api/items', status='201').inc()
        return db_item

# Get item by ID
@app.get("/api/items/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int, db: Session = Depends(get_db)):
    """Get specific item by ID."""
    with REQUEST_LATENCY.labels(method='GET', endpoint='/api/items/{id}').time():
        item = db.query(DBItem).filter(DBItem.id == item_id).first()
        if not item:
            REQUEST_COUNT.labels(method='GET', endpoint='/api/items/{id}', status='404').inc()
            raise HTTPException(status_code=404, detail="Item not found")
        REQUEST_COUNT.labels(method='GET', endpoint='/api/items/{id}', status='200').inc()
        return item

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    REQUEST_COUNT.labels(method='GET', endpoint='/', status='200').inc()
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/health",
        "metrics": "/metrics"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)
