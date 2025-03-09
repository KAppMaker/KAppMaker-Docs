---
sidebar_position: 14
---

# Google AdMob Ads

By default ads are disabled, you can enable it by setting `FeatureFlagManager`' s `IS_ADS_ENABLED` field value to `true`. Since it is added in FeatureFlagManager, you can also configure visibility of ads using Firebase Remote Config and setting `is_ads_enabled` boolean field value `true` or `false`. For more information about Feature Flags: https://docs.kappmaker.com/features/feature-flag

**3 types of AdMob Ads** are supported: 
- **Banner Ads** (https://developers.google.com/admob/android/banner).
For showing Banner ads, add below `Composable` in any screen you want: 
```kotlin
AdmobBanner(modifier = Modifier.fillMaxWidth())
```

-  **Interstitial ads** (https://developers.google.com/admob/android/interstitial): 

```kotlin
val interstitialAdDisplayer = rememberInterstitialAdDisplayer()

// Call `show` method when some button click happens, or on some action
interstitialAdDisplayer?.show()
```


- **Rewared ads** (https://developers.google.com/admob/android/rewarded):

```kotlin
val rewardedAdDisplayer = rememberRewardedAdDisplayer(onRewarded = {rewardItem ->
    //Reward User in this callback
    AppLogger.d("User earned reward: amount: ${rewardItem.amount}, type: ${rewardItem.type}")
})

// Call `show` method when some button click happens, or on some action
rewardedAdDisplayer?.show()
```


You also need to add below ad ids to `local.properties` based on platform and ad type you want to support, 

```gradle

#Android 
ADMOB_APP_ID_ANDROID=
ADMOB_BANNER_AD_ID_ANDROID=
ADMOB_INTERSTITIAL_AD_ID_ANDROID=
ADMOB_REWARDED_AD_ID_ANDROID

#iOS
ADMOB_BANNER_AD_ID_IOS=
ADMOB_INTERSTITIAL_AD_ID_IOS=
ADMOB_REWARDED_AD_ID_IOS
```

**For iOS, you need to add app id to `BaseConfig.xcconfig` file and add it as ADMOB_APP_ID=YOUR_ADMOB_IOS_APP_ID_HERE**. 

If you need preload ads beforehand, just get injected `adsManager`, and you can call `load` function. Since `rewardedAdLoader` and  `interstitialAdLoader` is singleton objects, it is safe to call `load` method beforehand.

```kotlin
// Get injected value, for example using koinInject<AdsManager>() in @Composable function
val adsManager: AdsManager 
adsManager.rewardedAdLoader.load()
adsManager.interstitialAdLoader.load()

```

---

_NOTE: The reason is `rewardedAdDisplayer` or `interstitialAdDisplayer` is nullable, because it can be configured to be allowed or not allowed. For example, in case `IS_ADS_ENABLED` value is `false` then `rewardedAdDisplayer` and  `interstitialAdDisplayer` will be `null`, so it will not be possible to show ads.  You can check `AdMobComposableFunctions` for more details._






