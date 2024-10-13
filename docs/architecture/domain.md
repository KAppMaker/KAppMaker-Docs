---
sidebar_position: 2
---

# Domain Package

The **Domain** package contains the essential business logic and core entities of the application.

![Domain Package](/img/architecture_domain.png)  


## Model Package 
Defines key data classes.
   - **User**: Represents a user with properties like `id`, `email`, and `hasPremiumAccess`.
   - **AuthProvider**: Enum for authentication methods (e.g., GOOGLE, APPLE).

## Exceptions Package

Contains custom exception classes that handle specific error scenarios within the application.

- **UnAuthorizedException**: This exception is thrown when a user attempts to perform an operation without being logged in. When you need to perform an operation that requires user authentication, throw the *UnAuthorizedException*, then, for example, in your ViewModel, you can catch this exception and show an appropriate view to the user. This is how it's implemented in **ProfileUiStateHolder**. When the user is not authenticated, the exception is caught, and the application navigates to the sign-in screen.
