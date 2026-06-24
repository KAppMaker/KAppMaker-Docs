---
sidebar_position: 2
---

# Domain Package

The **Domain** package contains the essential business logic and core entities of the application.

```
domain/
├── model/         immutable domain entities
│   ├── User.kt, AuthProvider.kt, Subscription.kt, ExampleModel.kt
│   ├── credit/        CreditSystemConfig.kt, CreditTransaction.kt, RecurringCredit.kt, …
│   └── generation/    GenerationInput.kt, GenerationOutput.kt, GenerationParam.kt, …
├── exceptions/    domain-specific exceptions
└── usecase/       use cases, added only when orchestration is justified
```

## model

Immutable `data class`es representing core business entities:

- `User` — a user, with properties like `id`, `email`, and `hasPremiumAccess`.
- `AuthProvider` — enum of authentication methods (e.g. `GOOGLE`, `APPLE`).
- `Subscription` — subscription information and access levels.
- `GenerationInput` / `GenerationOutput` — the AI generation workflow.
- `CreditTransaction` / `CreditSystemConfig` — the credit system (balance, transactions, configuration).

## exceptions

Domain-specific exceptions for known error scenarios:

- `UnAuthorizedException` — the user tried to perform an operation while logged out. Catch
  it in your `UiStateHolder` and navigate to the sign-in screen — see `ProfileUiStateHolder`
  for an example.
- `PurchaseRequiredException` — the operation requires a premium subscription the user doesn't have.
- `CreditRequiredException` — the operation requires more credits than the user's balance.
- `UserAlreadyExistsException` — attempted to create a user that already exists.
