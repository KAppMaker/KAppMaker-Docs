---
sidebar_position: 4
---

# Presentation Package

The **Presentation** package holds the app's user interface.

```
presentation/
├── components/    reusable composables (toolbar, dialogs, ads, credit, premium)
├── navigation/    Routes.kt, NavigationState.kt, Navigator.kt, AppNavigation.kt
└── screens/       one folder per screen (home, gallery, account, paywall, onboarding, …)
```

The app's visual style — colors, typography, and light/dark themes — lives separately in the
`designsystem` module, so it can be reused across modules.

### components

Reusable UI elements like the toolbar, loading indicators, and dialogs that keep the design
consistent across the app.

### navigation

Every navigation destination, the back-stack model, the `Navigator` API, and the root
`AppNavigation` composable. Feature folders intentionally contain no navigation glue — see the
dedicated [Navigation](navigation.md) page for the full picture.

### screens

Every screen in the app. Each screen folder follows the same structure:

- `Screen` — the main composable for the UI.
- `UiState` — the current state of the screen; it also defines `UiEvent`, the user actions the screen handles.
- `UiStateHolder` — manages the screen's state. It's an abstract class extending `ViewModel`
  from `androidx.lifecycle` that reads `UiState` and handles the `UiEvent`s triggered by the user.

The route definitions and the wiring that connects each screen to the navigator (push targets, back behaviour, parameter passing) live in `presentation/navigation/Routes.kt` and `AppNavigation.kt`, not in the feature folder.

For new screens, extend the `UiStateHolder` class. When you need to call a suspend function, do so within the `uiStateHolderScope.launch`, which delegates to `viewModelScope`.

```kotlin
class NewUiStateHolder() : UiStateHolder() {
    fun testFunction() = uiStateHolderScope.launch {
        //Call suspend function
    }
}
```

To obtain a holder instance inside the `entry<…>` block in `AppNavigation.kt`, use the `uiStateHolder` helper:

```kotlin
entry<OnBoardingScreenRoute> {
    val holder = uiStateHolder<OnBoardingUiStateHolder>()
    OnBoardingScreen(uiStateHolder = holder, /* … */)
}
```

The Navigation 3 entry decorator scopes ViewModels to their `NavEntry`, so each holder lives as long as its destination is on the back stack and is cleared automatically when popped — no separate "navigator-scoped" helper needed.

Ensure that the DI setup is done in `root/Di.kt` within the `presentationModule`, for example, by adding `viewModelOf(::NewUiStateHolder)` to handle dependencies for the new *UiStateHolder*.
