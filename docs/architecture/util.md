---
sidebar_position: 6
---


# Util Package

The **Util** package provides utility classes, constants, and helpers used across the app — coroutine scopes, logging, UI messaging, and shared extensions.

```
util/
├── Constants.kt, Platform.kt, ApplicationScope.kt, UiMessage.kt
├── logging/       Logger.kt, NapierLogger.kt, …
├── analytics/     Analytics.kt
├── extensions/    DateTimeFormatExt.kt, ViewExt.kt, …
├── file/          FileManager.kt
├── permissions/   AppPermissionState.kt
└── inappreview/   InAppReviewManager.kt
```

## ApplicationScope

`ApplicationScope` provides a `CoroutineScope` for work that should keep running while the app
is open but isn't tied to a specific screen — and shouldn't be canceled when the user navigates
away. For example: background fetches, sending analytics, refreshing user tokens.

## UiMessage

`UiMessage` is a sealed interface for UI messages:

- `Resource` — wraps a string resource to display in the UI.
- `Message` — wraps a plain-text message.

It exposes a `value` property you can read inside composables.

## AppLogger

`AppLogger` is an object implementing the `Logger` interface (delegating to the Napier library).
It initializes logging and exposes methods for errors, debug output, and general messages:

- `initialize(isDebug: Boolean)` — initializes logging based on the build type.
- `e(message, throwable, tag)` — logs an error.
- `d(message, throwable, tag)` — logs a debug message.
- `i(message, throwable, tag)` — logs an informational message.

It's initialized at application startup for centralized logging.

## Constants

The `Constants` object holds app-wide constants:

- `URL_PRIVACY_POLICY` and `URL_TERMS_CONDITIONS` — privacy policy and terms & conditions links.
- `PAYWALL_PREMIUM_ACCESS` — the default entitlement key for premium access (`Premium`).
- `SHOW_REMOTE_PAYWALL` — a feature flag (in `FeatureFlagManager`) that toggles between the remote
  and custom paywall screens. By default the remote paywall is shown, which you can update from your
  subscription provider's dashboard or via Firebase Remote Config.

## Extensions

Extension functions that simplify common operations live in `util/extensions/`.

## Platform file

For platform-specific functionality, use Kotlin's `expect` / `actual` mechanism in `Platform.kt`.