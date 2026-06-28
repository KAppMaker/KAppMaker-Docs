---
sidebar_position: 1
---

# Architecture Overview

KMPStarterKit follows a layered architecture with a single, one-way dependency
flow. Each layer depends only on the one below it:

```
Presentation   screens, ViewModels, components, navigation
     │  depends on
Domain         models, exceptions, use cases (only when justified)
     │  depends on
Data           repositories, API services, local DB, preferences, feature flags
```

The shared code is organized into these top-level packages under
`com.kotlinfoundation.kmpstarterkit`:

```
com.kotlinfoundation.kmpstarterkit
├── data/          repositories + data sources (remote, local, preferences, featureflag)
├── domain/        models, exceptions, and use cases
├── presentation/  screens, components, and navigation
├── root/          App, AppInitializer, Di (entry point + bootstrap)
└── util/          logging, coroutine scopes, constants, extensions, platform code
```

## Layers

- **[Data](data.md)** — the source of truth for app data.
  - `repository/` — repositories that expose data to the rest of the app and wrap
    error handling (`UserRepository`, `SubscriptionRepository`, …).
  - `source/remote/` — Ktor API services and request/response models.
  - `source/local/` — the Room 3 database, DAOs, and entities (runs on every platform).
  - `source/preferences/` — key/value user preferences backed by DataStore.
  - `source/featureflag/` — feature flags backed by Firebase Remote Config.

- **[Domain](domain.md)** — pure business logic, free of platform and UI concerns.
  - `model/` — immutable domain entities.
  - `exceptions/` — domain-specific exceptions.
  - `usecase/` — use cases, added only when real orchestration is needed.

- **[Presentation](presentation.md)** — the UI.
  - `screens/` — one folder per screen, each with its `Screen`, `UiState`, and `ViewModel`.
  - `components/` — reusable composables shared across screens.
  - `navigation/` — see the dedicated [Navigation](navigation.md) page.

- **Root** — the application entry point. `AppInitializer` runs the startup bootstrap
  (loads the Koin modules and one-time side effects); the module definitions live next
  to it in `Di.kt`. See [Dependency Injection](di.md).

- **[Util](util.md)** — cross-cutting helpers: logging, coroutine scopes, constants,
  extensions, and `expect`/`actual` platform code.
