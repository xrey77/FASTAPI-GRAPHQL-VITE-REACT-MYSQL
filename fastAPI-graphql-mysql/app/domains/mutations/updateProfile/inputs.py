import strawberry

@strawberry.input
class ProfileInput:
    id: int
    firstname: str
    lastname: str
    mobile: str



