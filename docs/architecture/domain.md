---
sidebar_position: 2
---

# Domain Package

The **Domain** package contains the essential business logic and core entities of the application.

![Domain Package](/img/architecture_domain.png)  


## Model Package
Defines key data classes representing core business entities:
   - **User**: Represents a user with properties like `id`, `email`, and `hasPremiumAccess`.
   - **AuthProvider**: Enum for authentication methods (e.g., GOOGLE, APPLE).
   - **Subscription**: Represents subscription information and access levels.
   - **GenerationOutput / GenerationInput**: Models for AI generation workflow.
   - **CreditTransaction / CreditSystemConfig**: Models for the credit system (balance, transactions, configuration).

## Exceptions Package

Contains custom exception classes that handle specific error scenarios within the application.

- **UnAuthorizedException**: Thrown when a user attempts to perform an operation without being logged in. In your UiStateHolder, you can catch this exception and navigate to the sign-in screen. See **ProfileUiStateHolder** for an example.
- **PurchaseRequiredException**: Thrown when an operation requires a premium subscription that the user does not have.
- **CreditRequiredException**: Thrown when an operation requires credits that the user does not have sufficient balance for.
- **UserAlreadyExistsException**: Thrown when attempting to create a user that already exists.
