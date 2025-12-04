---
sidebar_position: 17
---



#  Flexible Local Credit System

This feature adds a **fully configurable, extensible credit system** to the app. Users can  **earn, purchase, and spend credits**, and apps can configure any combination of **one-time rewards**, **recurring rewards**, and **credit sources** using a simple DSL. It also introduces a **Credit Balance screen**, transaction logs, to integrate in-app purchases with the credit system. See usage below


------------------------------------------------------------------------

## 🚀 Features Included

### **1. Core Credit System**

-   `CreditRepository` handles:
    -   Current balance
    -   Adding/removing credits
    -   Transaction history
    -   One-time credit rewards
    -   Recurring daily/weekly/monthly rewards\
    -   Credit source ordering and deduction logic
-   All transactions are logged with `CreditTransaction` (type,
    timestamp, amount, description).

### **2. Configurable Credit Behavior (DSL)**

Apps can define **credit sources + rules** using the new `creditSystemConfig` DSL in `AppInitializer` `initializeCreditSystem` method.

Example:

``` kotlin
// see AppInitializer.kt `initializeCreditSystem` method
val appCreditSystemConfig = creditSystemConfig {
    // One-time bonus for new users
    oneTimeBonus("welcome_bonus", 1)

    // Free plan → 2 credits weekly
    recurringWeekly(
        id = "free_plan_weekly",
        amount = 2,
        condition = { !subscriptionRepository.hasPremiumAccess() }
    )

    // Premium → 10 credits weekly
    recurringWeekly(
        id = "premium_weekly",
        amount = 10,
        condition = { 
            val sub = subscriptionRepository.getCurrentPremiumSubscription()
            sub != null && sub.durationType == DurationType.WEEKLY
        }
    )

    // Premium → 1 credit daily
    recurringDaily(
        id = "premium_daily",
        amount = 1,
        condition = { 
            subscriptionRepository.hasPremiumAccess()  //Check duration as well if needed
        }
    )
}
```

------------------------------------------------------------------------

## 🧩 3. UI Enhancements

### **CreditBalanceScreen**

A new screen showing: - Current credit balance\
- Progress of recurring rewards\
- A transaction list\
- Buttons to buy credits or upgrade to premium

### New navigation + toolbar badge

-   Home Screen now displays the credit balance in the toolbar\
-   Tapping it opens `CreditBalanceScreen`



------------------------------------------------------------------------


## 🔧 4. How to Use the Credit System

### **Add Credits**

Call this in events such as: - Successful in-app purchase\
- Rewarded ads\
- Promo codes

``` kotlin
creditRepository.addCredits(
    amount = 10,
    type = CreditTransaction.Type.PURCHASE,
    description = "10-credit pack"
)
```

### **Use Credits**

Most actions should deduct **1 credit by default**:

``` kotlin
creditRepository.useCredits()          // uses 1 credit
creditRepository.useCredits(3)         // uses 3 credits
creditRepository.useCredits(1, "AI Room Generation")
```

If balance is insufficient, `CreditRequiredException` is thrown.

------------------------------------------------------------------------

## 🗄️ 5. Storage & Security Notes

### **Local-only storage (default)**

The system stores: Credit balances, Source balances,  Transaction logs entirely on-device using mix of `userPreferences` and local db.

### **Optional backend syncing**

For higher security or when scaling: - You *can* sync credits or transactions to a backend (e.g., Firestore) - But this increases cost & complexity - Recommended only if: - You notice anomalies \ You need cross-device sync \ You need server-verified credit purchases

Most apps won't need this at early stages.

------------------------------------------------------------------------

## 🧪 6. Example Core Logic 

### **Using credits**

``` kotlin
suspend fun useCredits(amount: Int = 1, description: String?) { ... }
```

### **Adding credits**

``` kotlin
suspend fun addCredits(amount: Int, type, description?) { ... }
```

------------------------------------------------------------------------

This is released in `v2.5.0` version.