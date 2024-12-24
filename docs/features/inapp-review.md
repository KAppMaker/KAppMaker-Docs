---
sidebar_position: 4
---

# In-App Review/Rating

KAppMaker includes a built-in **In-App Review** feature, allowing you to request user rating directly within your app.

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
val reviewManager = rememberInAppReviewManager()
reviewManager.requestReview()
```