"""Configuration management for the application."""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings."""
    
    # Application
    app_name: str = "Observability Backend API"
    app_version: str = "1.0.0"
    environment: str = os.getenv("ENVIRONMENT", "development")
    
    # Database
    db_host: str = os.getenv("DB_HOST", "localhost")
    db_port: int = int(os.getenv("DB_PORT", "5432"))
    db_name: str = os.getenv("DB_NAME", "appdb")
    db_user: str = os.getenv("DB_USER", "dbadmin")
    db_password: str = os.getenv("DB_PASSWORD", "password")
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    
    @property
    def database_url(self) -> str:
        """Get database connection URL."""
        return f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"
    
    class Config:
        """Pydantic config."""
        env_file = ".env"

# Create settings instance
settings = Settings()
