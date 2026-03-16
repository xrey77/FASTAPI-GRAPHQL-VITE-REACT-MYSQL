import strawberry

@strawberry.input
class OtpInput:
    id: int
    otp: str



