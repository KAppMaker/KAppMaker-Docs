---
sidebar_position: 8
---

# User Preferences

KMPStarterKit allows you to store and manage user preferences, such as whether the onboarding screen has been shown or any custom user settings. You can save and retrieve different types of data like strings, integers, and booleans using simple key-value pairs. This is handled by [Jetpack DataStore Preferences](https://developer.android.com/kotlin/multiplatform/datastore), which works on every target: file-based storage on Android, iOS, and JVM Desktop, and browser `localStorage` (`WebLocalStorage`) on web (js/wasmJs).

All `UserPreferences` functions are `suspend` — call them from a coroutine (e.g. inside a `ViewModel` scope or repository).

Under the hood, each platform supplies a `PreferencesDataStoreProviderImpl` (mirroring the `DatabaseProvider` pattern) that creates the `DataStore<Preferences>` instance with the right storage location for that platform.

### Preferences

Using `UserPreferences` you can save specific keys, such as:

- **Onboarding shown**: `KEY_IS_ONBOARD_SHOWN`
- **Theme mode**: Save user preference for light or dark mode.

First add the key into `Keys` object of `UserPreferences`:

```kotlin
companion object Keys {
    const val KEY_IS_ONBOARD_SHOWN = "KEY_IS_ONBOARD_SHOWN"
}
```

To save a boolean value indicating that the onboarding screen has been shown, use:

```kotlin
userPreferences.putBoolean(KEY_IS_ONBOARD_SHOWN, true)
```

To retrieve a boolean value indicating that the onboarding screen has been shown, use:

```kotlin
userPreferences.getBoolean(KEY_IS_ONBOARD_SHOWN)
```

To clear all user preference use:

```kotlin
userPreferences.clear()
```

