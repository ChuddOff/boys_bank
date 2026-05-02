def validate_users(from_user: str, to_user: str):
    if not from_user or not to_user:
        raise ValueError("Users must not be empty")
