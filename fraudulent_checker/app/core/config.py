from pydantic import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Fraud Detection API"
    debug: bool = True


settings = Settings()
