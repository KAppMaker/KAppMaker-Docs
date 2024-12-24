---
sidebar_position: 5
---

# Network

KAppMaker uses [Ktor](https://ktor.io/) for network operations to manage HTTP requests and responses across different platforms.

## HttpClientFactory

The `HttpClientFactory` file, located at `commonMain/data/source/remote`, is where you can configure the **BASE URL** and customize the HTTP client for your application. The `HttpClientFactory` is already configured with essential features:

- **Logging**: Network requests and responses are logged for easier debugging.
- **Header Interceptor**: To send user tokens in all request headers.
- **JSON Configuration**: Configured to handle JSON serialization and deserialization efficiently.
