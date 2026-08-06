from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.core.config import settings

security_scheme = HTTPBearer(auto_error=False)


class AdminUser:
    def __init__(self, username: str, role: str = "admin") -> None:
        self.username = username
        self.role = role


def decode_token(token: str) -> AdminUser:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        username = payload.get("sub")
        role = payload.get("role", "admin")
        if not username:
            raise ValueError("Missing sub")
        return AdminUser(username=username, role=role)
    except (JWTError, ValueError) as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc


def get_current_admin(credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme)) -> AdminUser:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization")
    return decode_token(credentials.credentials)
