---
sidebar_position: 8
---

# User Preferences

KAppMaker allows you to store and manage user preferences, such as whether the onboarding screen has been shown or any custom user settings. You can save and retrieve different types of data like strings, integers, and booleans using simple key-value pairs. This is handled by [Multiplatform Settings](https://github.com/russhwolf/multiplatform-settings). 

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
userPreferences.getBooleadn(KEY_IS_ONBOARD_SHOWN)
```

To clear all user preference use:

```kotlin
userPreferences.clear()
```

