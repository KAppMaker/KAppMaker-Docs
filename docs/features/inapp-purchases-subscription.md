---
sidebar_position: 3
---

# In-App Purchases & Subscriptions

KAppMaker simplifies handling in-app purchases and subscriptions with support for two subscription providers: [Adapty](https://adapty.io/) (the default) and [RevenueCat](https://www.revenuecat.com/). You can switch between them at build time. KAppMaker supports both a remote paywall UI and a pre-configured subscription/in-app purchase screen. The remote paywall allows you to update pricing and product details directly from the provider's dashboard, without requiring an app update.

### Choosing a Subscription Provider

KAppMaker supports two subscription providers out of the box. The default is **Adapty**. You can switch between them by setting the `SUBSCRIPTION_PROVIDER` property in `gradle.properties`:

```properties
# Possible options: ADAPTY (default), REVENUECAT
SUBSCRIPTION_PROVIDER=ADAPTY
```

The subscription system uses a modular architecture with separate modules:
- **subscription-api** — Common interface contracts shared by both providers
- **subscription-adapty** — Adapty implementation
- **subscription-revenuecat** — RevenueCat implementation

The active provider is selected at compile time based on the `SUBSCRIPTION_PROVIDER` property. You only change this one property — `Constants` resolves the chosen provider automatically (it never names a concrete provider), so the build and app code can't drift.

### Setting Up RevenueCat

1. **Update `local.properties` with API Keys**:
   - Set the following keys in your `local.properties` file:
     - `SUBSCRIPTION_PROVIDER_ANDROID_API_KEY=`: Set this to your RevenueCat **Android API Key**.
     - `SUBSCRIPTION_PROVIDER_IOS_API_KEY=`: Set this to your RevenueCat **iOS API Key**.

2. **Add Products to App Store and Play Store**:
   - In **Google Play Console**, go to the **Monetization Setup** section, and create your in-app products and subscriptions.
   - In **Apple App Store Connect**, navigate to the **Features > In-App Purchases** section and add your in-app products and subscriptions.

3. **Configure Products in RevenueCat**:
   - Log in to your [RevenueCat Dashboard](https://app.revenuecat.com/).
   - Create your products in RevenueCat and link them to the corresponding products in the App Store and Play Store.
   - After configuring, you can manage your paywall and product offerings remotely through RevenueCat.


4. **Enable In-App Purchase (For iOS)**:
    - In Xcode, go to your project settings.
    - Select your target, then navigate to the **Signing & Capabilities** tab.
    - Click the "+" button and add the **In-App Purchase** capability.

### Entitlements in RevenueCat

An **entitlement** in RevenueCat represents a specific access level or feature granted to the user upon purchase. By default, KAppMaker comes with one pre-configured entitlement named **"Premium"**.

If you need to check whether a user has access to a specific entitlement, you can use the `hasPremiumAccess` field from the `currentUser` object. This checks whether the user has purchased the "Premium" subscription.

### Customizing Entitlements

If you want to change the default "Premium" entitlement, you can modify its value in the `Constants` file located in the `commonMain/util` package, by updating the `PAYWALL_PREMIUM_ACCESS` field.

For example, if you have two entitlements, **Silver** and **Gold**, you can use the `hasEntitlementAccess(key: String)` method from `UserRepository` to check whether the user has access to either subscription:

```kotlin
suspend fun hasPremiumAccess() = hasEntitlementAccess("gold") || hasEntitlementAccess("silver")
```

### Showing Remote or Custom Paywall UI

By default, KAppMaker shows the **pre-configured custom paywall screen** (`SHOW_REMOTE_PAYWALL = false` in `FeatureFlagManager`). It fully handles displaying products/subscriptions, purchasing, and restoring purchases according to App Store and Play Store guidelines, and gives you full design control because the entire UI lives in your codebase.

If you'd rather manage the paywall remotely — adjust pricing, swap copy, run experiments without shipping a new build — flip `SHOW_REMOTE_PAYWALL` to `true` in `FeatureFlagManager` (located at `data/source/featureflag/`). KAppMaker then renders the provider's built-in remote paywall UI from RevenueCat or Adapty. Since this is a feature flag, you can also toggle it remotely via Firebase Remote Config without an app update.

### Custom Paywall Architecture

The custom paywall lives at `shared/src/commonMain/kotlin/com/measify/kappmaker/presentation/screens/paywall/` and is split into three layers so that screens stay display-only and the formatting logic is unit-testable in isolation.

```
PaywallScreen.kt              # router — overlays + dispatches to a child screen
PaywallUiState.kt             # state, events, package UI state, mode enum
PaywallUiStateHolder.kt       # lifecycle: fetch / select / buy / restore
PaywallUiStateMapper.kt       # pure: PurchasePackage[] → PaywallUiState slice
PaywallPreviewData.kt         # @Preview fixtures
subscription/SubscriptionPaywallScreen.kt
creditpack/CreditPackPaywallScreen.kt
```

**`PaywallUiStateMapper`** is the brain. Given the raw `List<PurchasePackage>` + the selected id + the placement mode, it produces a `MappedPaywall` carrying:

- `packages: List<PaywallPackageUiState>` — one card per package with pre-built `title` / `subtitle` / `priceText` / `savingsBadge` as `UiText`.
- `ctaText` — button copy ("Continue" / "Try for $0.00" / "Buy credits").
- `aboveCtaText` — bold reassurance line shown immediately above the CTA ("Cancel anytime", "Save 90% on your first 3 months", "No payment required now").
- `belowCtaText` — fine-print compliance disclosure shown below the CTA when an intro phase exists ("3 days free, then $X/month. Cancel anytime."). Null otherwise.

It also exposes `pickDefaultSelection(...)` so the user lands on the BEST VALUE / SAVE N% plan — the same package that wears the chip — instead of the cheapest.

**`PaywallUiStateHolder`** stays thin: it owns the `StateFlow<PaywallUiState>`, calls the repository, dispatches purchase events, and calls `mapper.map(...)` whenever packages or selection change.

**`PaywallScreen`** is a one-shot router. It owns the `SuccessfulPurchaseView` overlay and the error dialog, then dispatches based on `uiState.mode`:

- `PaywallMode.SUBSCRIPTION` → `SubscriptionPaywallScreen`
- `PaywallMode.CREDIT_PACK` → `CreditPackPaywallScreen`

Each child screen owns its own `ScreenWithToolbar` (close icon + Restore action), so horizontal padding isn't applied twice.

### Adding a New Paywall Placement

To open the paywall as a credit pack (or any future placement), navigate with a placement id:

```kotlin
navigator.navigate(
    PaywallScreenRoute(placementId = Constants.PAYWALL_PLACEMENT_CREDITS_PACK),
)
```

`PaywallUiStateHolder` reads the placement id, derives a `PaywallMode`, and the mapper picks the right code path (subscription cards vs. credit-pack rows, different default-selection rules, different CTA / reassurance copy).

To introduce a brand-new placement type:

1. Add a constant in `Constants.PAYWALL_PLACEMENT_*`.
2. Add an entry to `PaywallMode`.
3. Branch the mapper's `map(...)` and `pickDefaultSelection(...)` for the new mode.
4. Route to the right child screen from `PaywallScreen`.
5. Add a new `paywall_<prefix>_*` group in `strings.xml`. Shared chrome (`paywall_*`, `paywall_unit_*`) is reusable.

### Paywall String Resources

All paywall copy lives in `composeResources/values/strings.xml` under three prefixes — drop a translated `strings.xml` next to the default one to add a locale.

| Prefix | Purpose |
|---|---|
| `paywall_*` | Shared chrome — toolbar action (`paywall_btn_restore`), footer links, BEST VALUE / SAVE N% badges. |
| `paywall_sub_*` | Subscription flow — plan titles, per-week subtitle, reassurance + disclosure templates, CTA copy. |
| `paywall_cp_*` | Credit-pack flow — title, subtitle, credits count, per-credit unit price, CTA copy. |
| `paywall_unit_*` | Period units as **plurals** (`paywall_unit_day` / `paywall_unit_day_count`). Bare form for noun suffixes (`/week`, `your first month`); count form for durations (`3 months`, `7 days`). |

Templates that need to embed another translated word (e.g. a localized unit) use `UiText.ofComposed(...)`. Plain primitive args use `UiText.of(stringRes, args)`. Plural-aware copy uses `UiText.of(pluralRes, count, args)`. See `designsystem/util/UiText.kt`.

### Previewing the Custom Paywall

`PaywallPreviewData` provides ready-made fixtures used by every `@Preview` and `@StoreScreenshot` composable in the paywall package:

```kotlin
@Preview(widthDp = 393, heightDp = 851)
@Composable
private fun SubscriptionPaywallScreen_Default_Preview() {
    AppTheme {
        SubscriptionPaywallScreen(
            uiState = PaywallPreviewData.subscriptionState(trialAvailable = false),
            onUiEvent = {},
        )
    }
}
```

Available fixtures: `subscriptionState(trialAvailable)`, `paidIntroSubscriptionState()`, `creditPackState()`, plus `subscriptionPackage(...)` / `creditPack(...)` builders for one-off rows. These bypass the real mapper, so previews don't need string resources or billing data wired up.

### Generating Paywall Store Screenshots

When you need real PNGs of the paywall to upload to the App Store / Play Store (or to attach to a review submission), don't take device screenshots by hand — generate them from the previews. Annotate a `@Preview @Composable` with `@StoreScreenshot` and run:

```bash
./scripts/generate_store_screenshots.sh
```

Output lands in `distribution/store_screenshots/<locale>/<device>/<tag>_<methodName>.png` — pure pixel captures at the storefront dimensions, ready to upload. KAppMaker ships with paywall captures already wired up: `paywall_review_screenshot_subscription` (no-trial / trial / paid-intro variants) and `paywall_review_screenshot_credits`.

To add your own, drop a `@StoreScreenshot`-tagged preview next to the screen and call `PaywallPreviewData.…`:

```kotlin
@Preview
@StoreScreenshot(device = StoreDevice.IPHONE_6_5, locale = "en", tag = "paywall_review_screenshot_subscription")
@Composable
private fun SubscriptionPaywallStoreScreenshot_Trial_iPhone_en() {
    AppTheme {
        SubscriptionPaywallScreen(
            uiState = PaywallPreviewData.subscriptionState(trialAvailable = true),
            onUiEvent = {},
        )
    }
}
```

For the full author + render pipeline (devices, locales, naming, CI integration), see the [Store Screenshots](./store-screenshots.md) guide.

### Setting Up Adapty

If you prefer to use Adapty instead of RevenueCat:

1. **Switch the provider** in `gradle.properties`:
   ```properties
   SUBSCRIPTION_PROVIDER=ADAPTY
   ```

2. **Update `local.properties` with Adapty API Keys** (same property names are used):
   - `SUBSCRIPTION_PROVIDER_ANDROID_API_KEY=`: Set this to your Adapty **Android API Key**.
   - `SUBSCRIPTION_PROVIDER_IOS_API_KEY=`: Set this to your Adapty **iOS API Key**.

3. **Configure products** in the [Adapty Dashboard](https://app.adapty.io/), linking them to your App Store and Play Store products.

The rest of the setup (adding products to stores, entitlements, paywall configuration) follows the same general steps as described above for RevenueCat.
