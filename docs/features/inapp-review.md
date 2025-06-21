---
sidebar_position: 4
---

# In-App Review/Rating

KAppMaker includes a built-in **In-App Review** feature, allowing you to request user rating directly within your app. To help boost app ratings and visibility, in-app reviews are automatically triggered after a successful purchase. This is based on the insight that paying users are more likely to leave positive reviews at that moment.


> "Reviews are vital for app visibility and credibility."

![In-App Rating](/img/feat_inapprating.png)    


### Best Practices
Request a review:
- After a positive user interaction (e.g., completing a task or feature).
- When users have spent sufficient time in the app.
- When user buys some in app purchase.

### Quota Restrictions
There is a limit to how often you can prompt users for reviews.
- [Android Quotas](https://developer.android.com/guide/playcore/in-app-review#quotas)
- [iOS Quotas](https://developer.apple.com/documentation/storekit/requesting-app-store-reviews)

### How To Use

```kotlin
val inAppReviewTrigger = rememberInAppReviewTrigger()

LaunchedEffect(Unit) {
    reviewTrigger.triggerAfterSuccessfulPurchase()
    // or
    reviewTrigger.triggerAfterImageIsGenerated() // Your custom logic
}
```

#### Customize for Your Use Case

You can easily **modify or add** new trigger methods inside the `InAppReviewTrigger` class based on your own logic. Cooldown logic (default: 7 days). If review is shown, it will not be shown again until `7` days passed. You can change this duration in `COOLDOWN_DURATION` in `InAppReviewTrigger` file.

🖼️ **Example**: Show review after generating an image (every 10 credits used)

```kotlin
/**
 * Tries to show review prompt after generating an image.
 * Shows once every 10 credits used.
 */
suspend fun triggerAfterImageIsGenerated() {
    val usedCredits = userPreferences.getInt(UserPreferences.KEY_NB_USER_USED_CREDIT, 0) ?: 0
    showReviewPromptIfEligible(
        condition = { usedCredits % 10 == 0 },
        onShown = {
            AppLogger.i("Tried to show in app review after image is generated")
        }
    )
}
```

If for some reason you need to ignore cooldown logic you can check `triggerAfterSuccessfulPurchase` method or just use it as below: 

```kotlin
val reviewManager = rememberInAppReviewManager()
LaunchedEffect(Unit) {
    reviewManager.requestReview()
}

```