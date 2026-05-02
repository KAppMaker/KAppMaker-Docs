---
sidebar_position: 7
---

# Screen Generator

Scaffold a new screen — generates the standard files **and** wires everything up so the screen is reachable end-to-end without hand-editing five files.


## How to Use

Run the script with your screen name as a single argument, from the `MobileApp/` directory:

```bash
./scripts/generate_screen.sh YourScreenName
```

Replace `YourScreenName` with the screen name (e.g., `Settings`). The script lives at `MobileApp/scripts/generate_screen.sh`.


## Default Values

The following default suffixes are used in the generation process:

- **Screen Suffix**: Screen
- **UI State Suffix**: UiState
- **UI Event Suffix**: UiEvent
- **ViewModel Suffix**: UiStateHolder


## What it does

The script generates three files in `presentation/screens/yourscreenname/`:

- `YourScreenNameScreen.kt`
- `YourScreenNameUiState.kt` (also contains `UiEvent`)
- `YourScreenNameUiStateHolder.kt`

It then patches three existing files (each insertion is idempotent — safe to re-run):

| File                                       | What gets inserted                                                            |
|--------------------------------------------|-------------------------------------------------------------------------------|
| `presentation/navigation/Routes.kt`         | `data object YourScreenNameScreenRoute : ScreenRoute` (with `@Serializable`/`@SerialName`) |
| `presentation/navigation/AppNavigation.kt`  | An `entry<YourScreenNameScreenRoute> { … }` block plus the screen/holder imports |
| `root/AppInitializer.kt`                    | `viewModelOf(::YourScreenNameUiStateHolder)` plus the holder import           |

The insertion points are marked in each file by a `// Add new … below — generate_screen.sh inserts here.` comment. Don't remove those markers — the script grep-checks them and warns if they're missing.

> **Note:** The previous Gradle task (`./gradlew generateNewScreen`) has been removed. Use the bash script.


## After running

The generated `entry<>` block is a no-callback stub:

```kotlin
entry<YourScreenNameScreenRoute> {
    val holder = uiStateHolder<YourScreenNameUiStateHolder>()
    YourScreenNameScreen(uiStateHolder = holder)
}
```

If your screen needs to navigate elsewhere, edit the block in `AppNavigation.kt` and add the callbacks (`onSomething = { navigator.navigate(SomeRoute) }`).
