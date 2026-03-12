import strawberry

@strawberry.input
class CreateUserInput:
    firstname: str
    lastname: str
    email: str
    mobile: str
    username: str
    password: str



