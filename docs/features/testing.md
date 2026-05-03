---
sidebar_position: 11
---

# Testing & Quality Gates

Every PR runs format, lint, unit tests, Compose UI tests, screenshot regression tests, and an Android debug build via [`.github/workflows/pr_checks.yml`](https://github.com/KAppMaker/KAppMaker-All/blob/main/.github/workflows/pr_checks.yml). Run the same gates locally before pushing.

All commands run from `MobileApp/`.

## Formatting & Lint — Spotless + ktlint

[Spotless](https://github.com/diffplug/spotless) drives [ktlint](https://github.com/pinterest/ktlint) across every module:

```bash
# Auto-fix every Kotlin source + Gradle KTS file:
./gradlew spotlessApply

# CI-style check (no edits, fails on violations):
./gradlew spotlessCheck
```

Rule overrides live in the root `MobileApp/build.gradle.kts` — Compose-friendly defaults disable rules that fight the framework (`function-naming` for `@Composable` PascalCase, `no-wildcard-imports` for the common `androidx.compose.foundation.layout.*` pattern, `max-line-length`).

## Unit & Compose UI Tests

Test source layout:
- `shared/src/commonTest/` — runs on both `:shared:jvmTest` and `:shared:testAndroidHostTest`. Use this for repository, use-case, and `UiStateHolder` tests.
- `shared/src/jvmTest/` — JVM-only. Use for headless Compose UI tests via `runComposeUiTest` (the multiplatform Compose test API).
- `shared/src/androidHostTest/` — Robolectric / Roborazzi screenshot tests + goldens (`snapshots/`).

Run:
```bash
./gradlew :shared:jvmTest :shared:testAndroidHostTest
```

### Patterns

**Suspend / dispatcher tests** — pass a `StandardTestDispatcher` tied to the `runTest` scheduler:

```kotlin
@Test
fun `executor returns success result`() = runTest {
    val executor = BackgroundExecutor(StandardTestDispatcher(testScheduler))
    val result = executor.execute { Result.success(42) }
    assertEquals(42, result.getOrNull())
}
```

**StateFlow / UiStateHolder tests** — collect emissions with `kotlinx-coroutines-test` (no Turbine needed). Override `Dispatchers.Main` so `viewModelScope` runs on a `TestDispatcher`:

```kotlin
@BeforeTest fun setUp() { Dispatchers.setMain(StandardTestDispatcher()) }
@AfterTest fun tearDown() { Dispatchers.resetMain() }

@Test
fun `incrementing emits initial then updated state`() = runTest {
    val holder = SampleCounterUiStateHolder()
    val emissions = mutableListOf<SampleCounterUiState>()
    val job = launch(UnconfinedTestDispatcher(testScheduler)) {
        holder.uiState.toList(emissions)
    }
    holder.onUiEvent(Increment); holder.onUiEvent(Increment)
    advanceUntilIdle()
    assertEquals(SampleCounterUiState(count = 2), emissions.last())
    job.cancel()
}
```

**Compose UI tests** — `runComposeUiTest` is the multiplatform Compose test API. Runs headlessly on JVM:

```kotlin
@OptIn(ExperimentalTestApi::class)
@Test
fun `clicking calls onClick`() = runComposeUiTest {
    var clicked = false
    setContent { ClickableLabel("Tap me", onClick = { clicked = true }) }
    onNodeWithText("Tap me").performClick()
    assertTrue(clicked)
}
```

## Screenshot Regression Tests

Powered by [Roborazzi](https://github.com/takahirom/roborazzi) + [ComposablePreviewScanner](https://github.com/sergio-sastre/ComposablePreviewScanner). Every `@Preview` under `com.measify.kappmaker.*` is automatically discovered, rendered via Robolectric, and snapshotted. **You don't write a test class** — just add a `@Preview` and re-run.

```bash
# Refresh goldens after a deliberate UI change:
./gradlew :shared:recordRoborazziAndroidHostTest

# Verify (CI step) — fails with diff PNGs if any preview drifts:
./gradlew :shared:verifyRoborazziAndroidHostTest
```

Goldens live under `MobileApp/shared/src/androidHostTest/snapshots/` (commit them). On CI, failed runs upload diff PNGs as artifacts.

### `@Preview` import — required

Always use `androidx.compose.ui.tooling.preview.Preview`:

```kotlin
import androidx.compose.ui.tooling.preview.Preview
```

The deprecated `org.jetbrains.compose.ui.tooling.preview.Preview` is **not** discovered by ComposablePreviewScanner. The multiplatform-aware AndroidX import is provided by the `org.jetbrains.compose.ui:ui-tooling-preview` artifact (already wired in `:shared` and `:designsystem`).

### Excluding flaky previews

Inherently non-deterministic composables (animations driven by `Random`, time-based effects) need to opt out — either:
- Drop `@Preview` from the flaky variant, OR
- Make the randomness deterministic in `LocalInspectionMode` (e.g. inject a seeded `Random` when previewing).

The codebase has one example: `ConfettiParticlesAnimatedPreview` in the design system has `@Preview` removed because confetti positions are random per render.

## Android Instrumented Tests

Device-required UI tests still live under `androidApp/src/androidTest/` and run with:

```bash
./gradlew :androidApp:connectedDebugAndroidTest
```

These don't run on PR checks — they need a connected device or emulator. Reserve them for tests that genuinely need the real Android runtime.
