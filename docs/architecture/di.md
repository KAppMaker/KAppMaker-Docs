---
sidebar_position: 6
---


# DI (Dependency Injection)

The project uses [Koin](https://insert-koin.io/) for Dependency Injection. DI setup is done in the `root/AppInitializer` file.

## Key Concepts in Koin:

- **single**: Used for creating singleton instances, meaning only one instance of the class will be created and shared.
- **factory**: Creates a new instance of the class each time it's injected.
- **bind**: Used to define the interface or superclass that the created instance will be bound to.  
    Example: `singleOf(::UserPreferencesImpl) bind UserPreferences::class`
- **singleOf**: Another way to declare a single using DSL.
- **factoryOf**: Another way to declare a factory using DSL.


## Example of DI Setup

In this project, the DI setup includes multiple modules:

- **Domain Module**: Used for core business logic.

- **Data Module**: Handles application data like repositories, preferences, and API services.
  - **Singletons**: `ApplicationScope`, `UserRepository`, `UserPreferences`.
  - **Factories**: For objects like `ApiService` and `BackgroundExecutor`.

- **Presentation Module**: Handles UI-related objects like `UiStateHolders` (ViewModel) for different screens such as `OnBoardingUiStateHolder`, `ProfileUiStateHolder`, and `PaywallUiStateHolder`. 


## Platform-Specific DI

The project uses Kotlin's `expect` and `actual` to define platform-specific dependencies. The `platformModule` is expected on different platforms (iOS, Android) and injected accordingly (see `util/Platform.kt`). This allows platform-specific implementations to be handled easily. For more information about achieving platform-specific DI with Koin in Kotlin Multiplatform, check out this article: [Achieving Platform-Specific Implementations with Koin](https://medium.com/proandroiddev/achieving-platform-specific-implementations-with-koin-in-kmm-5cb029ba4f3b).


For more information on using Koin, refer to [Koin Documentation](https://insert-koin.io/).