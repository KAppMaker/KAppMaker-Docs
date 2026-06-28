---
sidebar_position: 7
---


# DI (Dependency Injection)

The project uses [Koin](https://insert-koin.io/) for Dependency Injection. The Koin modules (`dataModule`, `domainModule`, `presentationModule`, and the `appModules` aggregate) are defined in the `root/Di.kt` file. The `root/AppInitializer` bootstrap loads them at startup via `startKoin { modules(appModules) }`.

## Koin APIs you'll use

These are the Koin APIs you reach for when registering dependencies in KMPStarterKit:

- `single` — registers a singleton: one shared instance for the whole app.
- `factory` — creates a new instance every time it's injected.
- `singleOf` / `factoryOf` — the constructor-reference DSL form of `single` / `factory` (e.g. `singleOf(::UserRepository)`).
- `bind` — binds the instance to an interface or superclass. Example: `singleOf(::UserPreferencesImpl) bind UserPreferences::class`.
- `viewModelOf` — registers a `ViewModel` in the presentation module. Example: `viewModelOf(::HomeViewModel)`.


## Example of DI Setup

In this project, the DI setup includes multiple modules:

- **Domain Module**: Used for core business logic.

- **Data Module**: Handles application data like repositories, preferences, and API services.
  - **Singletons**: `ApplicationScope`, `UserRepository`, `UserPreferences`.
  - **Factories**: For objects like `ApiService` and `BackgroundExecutor`.

- **Presentation Module**: Handles UI-related objects like `ViewModels` for different screens. ViewModels are registered using `viewModelOf()`, for example: `viewModelOf(::OnBoardingViewModel)`, `viewModelOf(::ProfileViewModel)`, `viewModelOf(::PaywallViewModel)`.


## Platform-Specific DI

The project uses Kotlin's `expect` and `actual` to define platform-specific dependencies. The `platformModule` is expected on different platforms (iOS, Android) and injected accordingly (see `util/Platform.kt`). This allows platform-specific implementations to be handled easily. For more information about achieving platform-specific DI with Koin in Kotlin Multiplatform, check out this article: [Achieving Platform-Specific Implementations with Koin](https://medium.com/proandroiddev/achieving-platform-specific-implementations-with-koin-in-kmm-5cb029ba4f3b).


For more information on using Koin, refer to [Koin Documentation](https://insert-koin.io/).