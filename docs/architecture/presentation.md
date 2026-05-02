---
sidebar_position: 4
---

# Presentation Package

![Presentation Package](/img/architecture_presentation.png)


The *Presentation* package manages the app's user interface (UI) and contains four sub-packages:

### Components
Contains reusable UI elements like the toolbar, loading indicators, and dialogs to maintain consistent design across the app.

### Theme
Manages the app's appearance, including colors, typography (fonts), and themes (dark/light theme), allowing easy customization of the app's visual style.

### Navigation
Holds every navigation destination, the back-stack model, the `Navigator` API, and the root `AppNavigation` composable. Feature folders intentionally don't contain navigation glue — see the dedicated [Navigation](navigation) page for the full picture.

### Screens
Contains all the screens in the app. Each screen folder follows a structured setup:

- **Screen**: The main composable function for the UI.
- **UiState**: Represents the current ui state of the screen, and also contains **UiEvent** to handle user actions and events on the screen.
- **UiStateHolder (ViewModel)**: Manages the screen's state. `UiStateHolder` is an abstract class extending `ViewModel` from `androidx.lifecycle`. It interacts with the UiState and handles events (UiEvent) triggered by user actions.

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

Ensure that the DI setup is done in `AppInitializer` within the `presentationModule`, for example, by adding `viewModelOf(::NewUiStateHolder)` to handle dependencies for the new *UiStateHolder*.
