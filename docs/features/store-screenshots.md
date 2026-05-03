---
sidebar_position: 19
---

# Store Screenshots

Render every storefront screenshot — App Store + Play Store, all locales — with a single command. Pure screen captures at the storefront pixel dimensions, ready to upload. No Fastlane, no ImageMagick, no Ruby toolchain.

```bash
./scripts/generate_store_screenshots.sh
```

Output lands at `distribution/store_screenshots/<locale>/<device>/<tag>_<methodName>.png`.

## Adding a screenshot

Drop a `@Preview @StoreScreenshot @Composable` function next to the screen it previews (e.g. inside `HomeScreen.kt`, `GalleryScreen.kt`):

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.measify.kappmaker.designsystem.theme.AppTheme
import com.measify.kappmaker.util.StoreDevice
import com.measify.kappmaker.util.StoreScreenshot

@Preview
@StoreScreenshot(device = StoreDevice.IPHONE_6_9, locale = "en", tag = "01-home")
@Composable
private fun HomeStoreScreenshot_iPhone_en() {
    AppTheme {
        HomeScreen(uiState = HomeUiState(creditBalance = 12), onUiEvent = {})
    }
}
```

Re-run the script — the new PNG appears in `distribution/store_screenshots/en/iphone_6_9/01-home_HomeStoreScreenshot_iPhone_en.png`. No config edits, no script changes.

The body of the preview should look exactly like what you want uploaded to the store. The captured PNG is the screen as rendered — no marketing chrome, no headlines, no device frames. If you want a slogan or background, build it directly in your composable (it's just Compose; do whatever you want).

## How it works

`@StoreScreenshot` and the `StoreDevice` enum live at
[`shared/src/commonMain/kotlin/com/measify/kappmaker/util/StoreScreenshot.kt`](https://github.com/KAppMaker/KAppMaker-All/blob/main/MobileApp/shared/src/commonMain/kotlin/com/measify/kappmaker/util/StoreScreenshot.kt).

The annotation is picked up by [`StoreScreenshotGeneratorTest`](https://github.com/KAppMaker/KAppMaker-All/blob/main/MobileApp/shared/src/androidHostTest/kotlin/com/measify/kappmaker/screenshot/StoreScreenshotGeneratorTest.kt), which uses [Roborazzi](https://github.com/takahirom/roborazzi) + [ComposablePreviewScanner](https://github.com/sergio-sastre/ComposablePreviewScanner) to render at the exact dimensions and write the PNG. Roborazzi's `composeTestRule` + `previewDevice` options resize the test activity surface so the captured bitmap matches the storefront resolution.

## `StoreDevice` enum — built-in storefront sizes

The enum [`StoreDevice`](https://github.com/KAppMaker/KAppMaker-All/blob/main/MobileApp/shared/src/commonMain/kotlin/com/measify/kappmaker/screenshot/StoreScreenshot.kt) ships with current Apple + Google storefront-required sizes:

| Value | Width × Height | Usage |
|-------|-----------------|-------|
| `IPHONE_6_9` | 1320 × 2868 | iPhone 16 Pro Max / 6.9" Display |
| `IPHONE_6_5` | 1284 × 2778 | iPhone 14 Pro Max / 6.5" Display |
| `IPAD_13` | 2064 × 2752 | iPad Pro 13" |
| `PIXEL_PHONE` | 1080 × 1920 | Google Play phone |
| `ANDROID_TABLET_10` | 1920 × 1200 | Google Play 10" tablet |

Add new entries as Apple / Google update specs.

## Localization

The `locale` parameter on `@StoreScreenshot` is set via `Locale.setDefault()` before render, so any `stringResource(...)` your composable uses renders in the right language. Author one preview per `(device × locale)` you want to ship.

## Excluded from regression tests

`@StoreScreenshot`-tagged previews are filtered out of the regular `:shared:verifyRoborazziAndroidHostTest` task — they render at huge pixel sizes and have different concerns. They only execute when you pass `-PgenerateStoreScreenshots=true` (which the script handles).
