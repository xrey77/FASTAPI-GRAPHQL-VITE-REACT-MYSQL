import strawberry

@strawberry.input
class UpdatePasswordInput:
    id: int
    password: str



