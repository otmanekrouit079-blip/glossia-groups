from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "sqlite:///./glossia.db"
    jwt_secret: str = "change-me"
    frontend_url: str = "http://localhost:3000"
    google_sheet_webhook_url: str = ""

    admin_username: str = "osmane Barber"
    admin_password: str = "otmankrouit199811"
    upload_dir: str = "uploads"

    meta_pixel_id: str = ""
    meta_capi_access_token: str = ""
    tiktok_pixel_id: str = ""
    tiktok_access_token: str = ""
    snapchat_pixel_id: str = ""
    snapchat_capi_access_token: str = ""


settings = Settings()
