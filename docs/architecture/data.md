---
sidebar_position: 3
---

# Data Package

The **Data** package manages data sources and provides a structured way to interact with external services such as databases, APIs, and preferences.

```
data/
├── repository/    repositories that wrap data access + error handling
└── source/
    ├── remote/        HttpClientFactory.kt, apiservices/, request/, response/
    ├── local/         Room 3: AppDatabase.kt, DatabaseModule.kt, dao/, entity/
    ├── preferences/   UserPreferences.kt (DataStore)
    ├── featureflag/   FeatureFlagManager.kt (Firebase Remote Config)
    └── ai/            AI generation data source
```

## repository

The `repository/` package is the abstraction layer between data sources and the rest of
the app. It encapsulates how data is read and persisted, keeping that consistent across
local databases, remote APIs, and in-memory storage.

- `UserRepository`
   - `currentUser` — a flow emitting the current user's information, managing authentication
     state and premium access.
   - `hasPremiumAccess()` — whether the current user has premium access. By default it checks
     the entitlement key `Premium`; change this key in `util/Constants.kt` to suit your app.
   - `hasEntitlementAccess(key: String)` — checks access to a specific entitlement, useful
     when you have multiple tiers (e.g. `Gold` and `Premium`).
   - `logOut()` — logs the user out of both the subscription provider and Firebase.
   - `deleteAccount()` — deletes the user's account and logs them out.
- `SubscriptionRepository` — in-app purchase and subscription state, wrapping the subscription provider (Adapty or RevenueCat).
- `GenerationRepository` — AI generation workflows: uploading files, triggering generation, and caching results (in-memory + Room).
- `CreditRepository` — credit balance and transactions with a configurable credit system (one-time bonuses, recurring grants).

## source

The `source/` package is split into **Preferences**, **Remote**, **Local**, and **FeatureFlag**.

### Preferences

`UserPreferences` manages key/value user settings — storing and retrieving strings, integers, and booleans.

### Remote

The `remote/` package makes API requests and handles responses. It contains:

- Request models — separate data models defining the structure of data sent to the server.
- Response models — data models for data received from the server, mapped to domain classes for easy access.
- `ApiService` — network requests. For example, `getExampleData()` sends a POST request and returns data from the server.
- `HttpClientFactory` — a configured HTTP client with the right headers and logging, including user authentication tokens.

### Local

The *Local* package contains Room 3 database entities and DAOs for local persistence. With Room 3 the `@Database`, `@Entity` and `@Dao` declarations live in `commonMain` and run on **all platforms — Android, iOS, JVM Desktop, and Web (wasmJs and js)** — via per-platform `SQLiteDriver`s (`BundledSQLiteDriver` for native, `WebWorkerSQLiteDriver` + OPFS for both web targets). See the [Local Storage](../features/local-storage.md) feature guide for setup details.

### FeatureFlag

Manages feature flags via Firebase Remote Config, allowing you to enable/disable features at runtime without app updates.


## BackgroundExecutor

`BackgroundExecutor` runs suspending functions in a given coroutine context (defaulting to
`Dispatchers.IO`), primarily for background tasks. Injecting the context also makes it easy
to test.

It takes a suspending function and returns a `Result<T>`, handling exceptions gracefully and
returning `Result.failure(e)` on failure.

Example:

```kotlin
suspend fun logOut() = backgroundExecutor.execute {
    Firebase.auth.signOut()
    Result.success(Unit)
}
```
