import re

PHONE_REGEX = re.compile(r"^(06|07)[0-9]{8}$")


def validate_morocco_phone(phone: str) -> str:
    clean = phone.replace(" ", "").replace("-", "")
    if not PHONE_REGEX.match(clean):
        raise ValueError("Invalid Moroccan phone number")
    return clean


def to_e164(phone: str) -> str:
    clean = validate_morocco_phone(phone)
    return f"+212{clean[1:]}"
