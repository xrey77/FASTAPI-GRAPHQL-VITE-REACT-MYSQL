import strawberry

@strawberry.input
class MfaActivationInput:
    id: int
    twofactorenabled: bool
