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
- **ScreenRoute**: Manages the navigation logic to and from the screen. `ScreenRoute` is an interface used for defining navigation routes between different screens in the app. To implement navigation for a screen, create a class that implements the `ScreenRoute` interface. If the screen needs to display a *title*, simply override the title field to specify the screen's title. See `SignInScreenRoute` as an example. See [Voyager](https://voyager.adriel.cafe/) navigation library for more advanced setup.

- **UiStateHolder (ViewModel)**: Manages the screen's state. It is the same thing as ViewModel. It interacts with the UiState and handles events (UiEvent) triggered by user actions.

    For new screens, simply implement the `UiStateHolder` interface for a screen. When you need to call a suspend function, do so within the `uiStateHolderScope.launch`, similar to how it's done in a `viewModelScope`.

    ```kotlin
    class NewUiStateHolder() : UiStateHolder {
        fun testFunction() = uiStateHolderScope.launch{
            //Call suspend function
        }
    }

    ```

    For creating instances of a UiStateHolder, the `uiStateHolder` function is used for most screens. See `OnBoardingScreenRoute` class.

    ```kotlin
    val uiStateHolder = navigator.uiStateHolder<OnboardingUiStateHolder>()
    ```

    However, for screens in the bottom navigation, you can use the `navigatorUiStateHolder` to ensure the ViewModel does not get recreated when switching between navigation items. This helps maintain a consistent state across navigations. See `ProfileScreenRoute` class.

    ```kotlin
    val uiStateHolder = navigator.navigatorUiStateHolder<ProfileUiStateHolder>()
    ```

    Additionally, ensure that the DI setup is done in the `AppInitializer` within the presentationModule, for example, by including `factoryOf(::NewUiStateHolder)` to handle dependencies correctly for the *UiStateHolder*.

