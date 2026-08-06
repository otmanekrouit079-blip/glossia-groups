from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def webhook_health() -> dict[str, str]:
    return {"status": "ok"}
