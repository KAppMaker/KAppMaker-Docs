---
sidebar_position: 4
---

# Presentation Package

![Presentation Package](/img/architecture_presentation.png)


The *Presentation* package manages the app's user interface (UI) and contains three sub-packages:

### Components
Contains reusable UI elements like the bottom navigation bar, toolbar, loading indicators, and dialogs to maintain consistent design across the app.

### Theme
Manages the app's appearance, including colors, typography (fonts), and themes (dark/light theme), allowing easy customization of the app's visual style.

### Screens
Contains all the screens in the app. Each screen follows a structured setup:
- **Screen**: The main composable function for the UI.
- **UiState**: Represents the current ui state of the screen, and also contains **UiEvent** to handle user actions and events on the screen.
- **ScreenRoute**: Manages the navigation logic to and from the screen. `ScreenRoute` is an interface that defines a `@Composable Content()` function. Route classes are annotated with `@Serializable` for type-safe navigation using [Compose Navigation](https://developer.android.com/develop/ui/compose/navigation). See `OnBoardingScreenRoute` as an example.

- **UiStateHolder (ViewModel)**: Manages the screen's state. `UiStateHolder` is an abstract class extending `ViewModel` from `androidx.lifecycle`. It interacts with the UiState and handles events (UiEvent) triggered by user actions.

    For new screens, extend the `UiStateHolder` class. When you need to call a suspend function, do so within the `uiStateHolderScope.launch`, which delegates to `viewModelScope`.

    ```kotlin
    class NewUiStateHolder() : UiStateHolder() {
        fun testFunction() = uiStateHolderScope.launch {
            //Call suspend function
        }
    }
    ```

    For creating instances of a UiStateHolder, the `uiStateHolder` function is used for most screens. See `OnBoardingScreenRoute` class.

    ```kotlin
    val uiStateHolder = uiStateHolder<OnboardingUiStateHolder>()
    ```

    For screens in the bottom navigation, you can use the `navigatorUiStateHolder` on the `NavHostController` to ensure the ViewModel is scoped to the navigation graph and does not get recreated when switching between navigation items. See `ProfileScreenRoute` class.

    ```kotlin
    val navigator = LocalNavigator.current
    val uiStateHolder = navigator.navigatorUiStateHolder<ProfileUiStateHolder>()
    ```

    Additionally, ensure that the DI setup is done in the `AppInitializer` within the presentationModule, for example, by including `viewModelOf(::NewUiStateHolder)` to handle dependencies correctly for the *UiStateHolder*.
