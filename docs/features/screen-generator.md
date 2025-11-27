---
sidebar_position: 7
---

# Screen Generator

The Screen Generator feature in KAppMaker automates the creation of new screens by generating all necessary files based on a specified screen name. This speeds up the development process by reducing boilerplate code and ensuring consistency across the application.


## How to Use

To generate a new screen, run the Gradle task with the screen name as a parameter as below:

```bash

./gradlew generateNewScreen -PscreenName=YourScreenName

```

Replace `YourScreenName` with the desired name for your screen (e.g., Profile). `generateNewScreen` gradle task is defined in `gradle/scripts` folder.

## Default Values

The following default suffixes are used in the generation process:

- **Screen Suffix**: Screen
- **UI State Suffix**: UiState
- **UI Event Suffix**: UiEvent
- **ViewModel Suffix**: UiStateHolder



## File Structure

The following files will be generated in the `presentation/screens/yourscreenname` directory:

- YourScreenNameScreen.kt
- YourScreenNameScreenRoute.kt
- YourScreenNameUiState.kt. This file will contain `UIEvent` as well.
- YourScreenNameUiStateHolder.kt



## Generated Files

1. **Screen Composable** (YourScreenNameScreen.kt):
   - Defines the composable function for rendering the UI.

2. **UI State Class** (YourScreenNameUiState.kt):
   - Contains the UI state representation for the screen and UiEvent, such as click action.

3. **ViewModel Class** (YourScreenNameUiStateHolder.kt):
   - Manages the UI state and handles UI events.

4. **Navigation Class** (YourScreenNameScreenRoute.kt):
   - Manages Navigation for the screen.


**Note:** Esure that the DI setup is done in the `AppInitializer` within the `presentationModule`, for example, by including `factoryOf(::YourScreenNameUiStateHolder)` to handle dependencies correctly for new created UiStateHolder.
