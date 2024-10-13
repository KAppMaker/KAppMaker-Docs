---
sidebar_position: 3
---

# Data Package

The **Data** package is responsible for managing data sources and provides a structured way to interact with various external services, such as databases, APIs, preferences. 

![Data Package](/img/architecture_data.png)  


## Repository Package

The *Repository Package* serves as an abstraction layer between the data sources and the rest of the application. It encapsulates the logic for accessing data, ensuring that data retrieval and persistence are handled consistently across different sources, such as local databases, remote APIs, or in-memory storage.

- **UserRepository**
   - `currentUser`: A flow that emits the current user's information, managing the authentication state and premium access status.
   - `hasPremiumAccess()`: Checks if the current user has premium access. By default it checks if the user has entitlement access for the key *"Premium"*. However, you can change this key in the `util/Constants` file to suit your application's needs.
   - `hasEntitlementAccess(key:String)`: If you have created multiple entitlements in RevenueCat (e.g., different subscription tiers such as "Gold" and "Premium"), you can use the this method to check access to these specific entitlements. 
   - `logOut()`: Logs the user out from both RevenueCat and Firebase.
   - `deleteAccount()`: Deletes the user's account and logs them out.

## Source Package

The **Source** component is further divided into two parts: **Preferences** and **Remote**. (Local Storage will be added soon too).

### Preferences

The **UserPreferences** manages key-value pairs for user preferences, allowing for easy storage and retrieval of user settings, such as, saving and retrieving strings, integers, and booleans.

### Remote

The *Remote* package is responsible for making API requests and handling responses. This includes:

- **Request Models**: Typically, it’s best practice to create separate data models for requests, which define the structure of the data being sent to the server.

- **Response Models**: Similarly, defining response data models helps in managing the data received from the server. These models can be mapped to appropriate classes for easy access.

- **ApiService**: Manages network requests, such as sending and receiving data. For example, the `getExampleData()` method sends a POST request and retrieves data from the server.

- **HttpClientFactory**: Provides a configured HTTP client, ensuring proper headers and logging for network requests, including user authentication tokens.


## BackgroundExecutor

The **BackgroundExecutor** class facilitates executing suspending functions in a specified coroutine context, primarily for background tasks. It defaults to `Dispatchers.IO`. This makes it easy for testing as well.

It takes a suspending function and returns a `Result<T>`, handling exceptions gracefully, returns `Result.failure(e)` for failures.

   #### Example Usage:

   ```kotlin
   suspend fun logOut() = backgroundExecutor.execute {
      Firebase.auth.signOut()
      Result.success(Unit)
   }
   ```
