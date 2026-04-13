---
sidebar_position: 5
---


# Util Package

The **Util** package provides a set of utility classes, constants, and interfaces used across the application to manage common tasks such as coroutines, logging, and screen routing.

![Util Package](/img/architecture_util.png)  


## ApplicationScope

The **ApplicationScope** class provides a `CoroutineScope` for running tasks that need to keep going while the app is open but aren't tied to a specific screen or feature. It's useful for background work that shouldn't be canceled when the user navigates away. Ex: fetching data on the background, sending analytics, refreshing user tokens.


## ScreenRoute

**ScreenRoute** is a simple interface that defines a `@Composable Content()` function. Route classes implement this interface and are annotated with `@Serializable` for type-safe navigation using [Compose Navigation](https://developer.android.com/develop/ui/compose/navigation). Each route class encapsulates its screen's navigation logic and UI composition.


## UiStateHolder

**UiStateHolder** is an abstract class extending `ViewModel` from `androidx.lifecycle`. It helps manage the state of UI screens. It provides a `uiStateHolderScope` extension property that delegates to `viewModelScope`, giving access to a coroutine scope for UI operations.

## UiMessage

**UiMessage** is a sealed interface used for representing UI messages:

- **Resource**: Wraps string resources to be displayed in the UI.
- **Message**: Wraps plain text messages.

UiMessage provides a `value` property, which can be accessed within Composables.


## AppLogger

**AppLogger** is an object implementing the **Logger** interface (delegating to *Napier* library). It initializes logging for the app and provides methods for logging errors, debug information, and general messages:

- `initialize(isDebug: Boolean)`: Initializes logging based on the build type.
- `e(message, throwable, tag)`: Logs error messages.
- `d(message, throwable, tag)`: Logs debug messages.
- `i(message, throwable, tag)`: Logs informational messages.

The **AppLogger** is initialized at the application startup to handle centralized logging across the app.

## Constants

The **Constants** object holds common constants used throughout the app:

- **URL_PRIVACY_POLICY** and **URL_TERMS_CONDITIONS**: Links for privacy policy and terms & conditions.
- **PAYWALL_PREMIUM_ACCESS**: Default entitlement/access level key for premium access is *"Premium"*.
- **SHOW_REMOTE_PAYWALL**: A feature flag (in `FeatureFlagManager`) to toggle between remote and custom paywall screens. By default remote paywall UI is shown that can be updated from your subscription provider's dashboard or via Firebase Remote Config.

## Extensions

The **Util** package also includes extension functions that simplify common operations.

## Platform file

If you need to implement platform-specific functionality, you can use Kotlin's *expect* and *actual* mechanisms in the *Platform* file.