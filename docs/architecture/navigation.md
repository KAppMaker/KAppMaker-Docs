---
sidebar_position: 5
---

# Navigation

KAppMaker uses **Jetpack Navigation 3** (KMP build) — `org.jetbrains.androidx.navigation3`. Navigation 3 ditches the `NavController`/`NavGraph` model: you own the back stack as plain state, and a single `NavDisplay` renders whatever's on top.

## Where it lives

All navigation code is consolidated under:

```
shared/src/commonMain/kotlin/com/measify/kappmaker/presentation/navigation/
├── Routes.kt           – every destination as a sealed @Serializable type
├── NavigationState.kt  – per-tab back stacks + active stack swap logic
├── Navigator.kt        – navigate / add / set / replace / switchToTab / goBack
└── AppNavigation.kt    – NavDisplay setup + the entryProvider with all entry blocks
```

Feature folders under `presentation/screens/<feature>/` only contain screen components (`*Screen.kt`, `*UiState.kt`, `*UiStateHolder.kt`) — no navigation glue.

## Routes

`Routes.kt` declares one `@Serializable sealed interface ScreenRoute : NavKey` and one concrete `data object` (or `data class` with arguments) per destination. A second sealed marker `TopLevelScreenRoute : ScreenRoute` tags routes that root a tab in the bottom navigation:

```kotlin
@Serializable sealed interface ScreenRoute : NavKey
@Serializable sealed interface TopLevelScreenRoute : ScreenRoute

@Serializable @SerialName("Home")    data object HomeScreenRoute    : TopLevelScreenRoute
@Serializable @SerialName("Gallery") data object GalleryScreenRoute : TopLevelScreenRoute
@Serializable @SerialName("Account") data object AccountScreenRoute : TopLevelScreenRoute

@Serializable @SerialName("GenerationResult")
data class GenerationResultScreenRoute(val id: String) : ScreenRoute
// ... rest of the routes
```

Why one sealed file:

- The `sealed` hierarchy gives kotlinx-serialization automatic polymorphic dispatch, which is what `rememberSerializable(SnapshotStateListSerializer())` uses to save and restore back stacks across configuration changes and process death.
- Kotlin requires direct subclasses of a sealed type to live in the same package, so all routes share `presentation/navigation/`.
- `@SerialName` values are the on-disk wire format for restored back stacks — keep them stable when renaming.

## Back-stack model

`NavigationState` keeps:

- A `currentBackstack: SnapshotStateList<ScreenRoute>` — the live stack the user is currently looking at.
- A per-tab storage map `topLevelBackStacks: Map<TopLevelScreenRoute, SnapshotStateList<ScreenRoute>>` — frozen snapshot of each inactive tab.
- A `defaultBackstack` for routes that aren't tabs (used when there's no active top-level).

Tab switching is implemented as a swap inside the `topLevelRoute` setter: copy `currentBackstack` contents into the old tab's storage, then load the new tab's storage into `currentBackstack`. State for each tab is preserved across switches.

Top-level destinations follow the **exit-through-home** pattern: `Home` is the primary tab, and `goBack` from the root of any other tab returns to `Home` rather than exiting the app.

## Navigator API

```kotlin
class Navigator(val state: NavigationState) {
    fun navigate(route: ScreenRoute)               // add or switchToTab based on type
    fun add(route: ScreenRoute)                    // push onto current stack
    fun set(route: ScreenRoute)                    // clear stack, push route
    fun replace(route: ScreenRoute)                // pop top, push route
    fun switchToTab(route: TopLevelScreenRoute)    // change active tab
    fun goBack()                                   // pop or fall back to primary tab
}
```

`navigate(route)` is the everyday call from screens — it dispatches to `switchToTab` for `TopLevelScreenRoute`s and to `add` otherwise. Use the more specific methods (`replace`, `set`) when you need them.

Access the navigator from any screen via the composition local:

```kotlin
val navigator = LocalNavigator.current
navigator.navigate(PaywallScreenRoute)
```

## Screen wiring (the entryProvider)

`AppNavigation.kt` defines a single `EntryProviderScope<ScreenRoute>.screens(navigator)` extension. Each entry calls a feature `*Screen` composable directly and wires its callbacks:

```kotlin
entry<HomeScreenRoute>(metadata = noAnimationMetadata) {
    val holder = uiStateHolder<HomeUiStateHolder>()
    HomeScreen(
        uiStateHolder = holder,
        onPremiumRequired = { navigator.navigate(PaywallScreenRoute) },
        // ...
    )
}

entry<GenerationResultScreenRoute> { key ->
    val holder = uiStateHolder<GenerationResultUiStateHolder>(parameters = { parametersOf(key.id) })
    GenerationResultScreen(uiStateHolder = holder, onNavigateToBack = { navigator.goBack() })
}
```

Top-level (tab) entries get `metadata = noAnimationMetadata` so tab switches are instant — only forward pushes animate.

ViewModels are scoped per `NavEntry` via the `rememberViewModelStoreNavEntryDecorator` registered in `NavigationState.toDecoratedEntries`. A ViewModel created for `HomeScreenRoute` survives recompositions and tab switches, and is cleared automatically when its entry leaves the back stack.

## Adding a new destination

Run the generator from `MobileApp/`:

```bash
./scripts/generate_screen.sh Settings
```

It creates `SettingsScreen.kt`, `SettingsUiState.kt`, `SettingsUiStateHolder.kt` under `presentation/screens/settings/`, registers the route in `Routes.kt`, inserts a stub `entry<SettingsScreenRoute> { … }` in `AppNavigation.kt`, and adds `viewModelOf(::SettingsUiStateHolder)` to `AppInitializer.kt`.

After it runs, edit the generated `entry<>` block in `AppNavigation.kt` to wire any navigation callbacks the screen needs (`onSomething = { navigator.navigate(SomeRoute) }`).

## Persistence

Each per-tab stack and the `currentBackstack` are wrapped with `rememberSerializable(SnapshotStateListSerializer<ScreenRoute>())`. Because `ScreenRoute` is a sealed `@Serializable` type, kotlinx-serialization handles the polymorphic save/restore automatically — no `SerializersModule` registration needed.

Result: rotating the device, toggling dark mode, or recovering from "Don't keep activities" puts the user back on the same screen they left, with their tab stacks intact.

## Performance notes

- **Top-level animations are disabled** via `noAnimationMetadata` on `Home`/`Gallery`/`Account` entries. Without this the default `NavDisplay` content animation runs on every tab tap and skips frames.
- **`entryProvider` is `remember`-ed** so the DSL builder doesn't reallocate the route → entry map on each recomposition.
- **Decorators are hoisted** out of the per-tab `mapValues` loop in `toDecoratedEntries` and wrapped in a `remember(...)`-cached list, keeping `rememberDecoratedNavEntries` reliably hitting its cache.
- **`toDecoratedEntries` returns a plain `List`** (not a `SnapshotStateList`); `NavDisplay` accepts it without copying.

## ProGuard / R8

Routes are referenced directly from `AppNavigation.kt`'s `entry<>` calls and `TOP_LEVEL_ROUTES`, so R8 keeps them naturally. As insurance for any future code that drives polymorphic (de)serialization of `NavKey` subtypes, `androidApp/proguard-rules.pro` keeps `**ScreenRoute` and their generated `$serializer` companions:

```pro
-keep class **ScreenRoute { *; }
-keep class **ScreenRoute$Companion { *; }
-keepclassmembers class **ScreenRoute {
    kotlinx.serialization.KSerializer serializer(...);
}
-keep,allowobfuscation,allowshrinking class **ScreenRoute$$serializer { *; }
```
