---
sidebar_position: 3
---

# In-App Purchases & Subscriptions

KAppMaker simplifies handling in-app purchases and subscriptions with support for two subscription providers: [RevenueCat](https://www.revenuecat.com/) and [Adapty](https://adapty.io/). You can switch between them at build time. KAppMaker supports both a remote paywall UI and a pre-configured subscription/in-app purchase screen. The remote paywall allows you to update pricing and product details directly from the provider's dashboard, without requiring an app update.

### Choosing a Subscription Provider

KAppMaker supports two subscription providers out of the box. You can switch between them by setting the `SUBSCRIPTION_PROVIDER` property in `gradle.properties`:

```properties
# Possible options: REVENUECAT, ADAPTY
SUBSCRIPTION_PROVIDER=REVENUECAT
```

The subscription system uses a modular architecture with separate modules:
- **subscription-api** — Common interface contracts shared by both providers
- **subscription-revenuecat** — RevenueCat implementation
- **subscription-adapty** — Adapty implementation

The active provider is selected at compile time based on the `SUBSCRIPTION_PROVIDER` property.

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

By default, KAppMaker shows the **remote paywall UI**. This allows you to manage and update your paywall directly through the RevenueCat dashboard without needing to publish a new version of the app. 

However, KAppMaker also comes with a **pre-configured custom paywall screen** that fully handles displaying products/subscriptions, purchasing, and restoring purchases according to App Store and Play Store guidelines. This custom paywall is implemented in the `PaywallScreen`.  

You can easily switch to the custom paywall screen by updating the `SHOW_REMOTE_PAYWALL` default value in the `FeatureFlagManager` (located at `data/source/featureflag/`). Set `SHOW_REMOTE_PAYWALL` to `false` to display your custom paywall UI instead of the remote one. Since this is a feature flag, you can also toggle it remotely via Firebase Remote Config without an app update.

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
