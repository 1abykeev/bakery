import random
from django.core.cache import cache

RESET_CODE_TIMEOUT = 600  # 10 minutes


def generate_reset_code() -> str:
    """Generate a random 6-digit code."""
    return str(random.randint(100000, 999999))


def store_reset_code(email: str, code: str) -> None:
    """Store the reset code in cache for 10 minutes."""
    cache_key = f"pwd_reset_{email}"
    cache.set(cache_key, code, timeout=RESET_CODE_TIMEOUT)


def get_reset_code(email: str) -> str | None:
    """Retrieve the reset code from cache."""
    return cache.get(f"pwd_reset_{email}")


def delete_reset_code(email: str) -> None:
    """Delete the reset code from cache after use."""
    cache.delete(f"pwd_reset_{email}")