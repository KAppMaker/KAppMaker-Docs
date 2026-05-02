---
sidebar_position: 1
---

# Architecture Overview!


## Architectural Illustration

The images below illustrates the high-level architecture of the KAppMaker project, showcasing the interaction between different components:

<!-- Set image height smaller -->
<!-- <img src="/img/architecture_1.png" alt="High-Level Architecture" height="400"/> -->
<!-- ![High-Level Architecture](images/architecture_1.png) -->

<div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <img src="/img/architecture_1.png" alt="High-Level Architecture of KAppMaker" height="500" style={{ marginRight: '10px' }} />
    <img src="/img/architecture_2.png" alt="High-Level Architecture of KAppMaker" height="500" style={{ marginRight: '10px' }} />
    <img src="/img/architecture_3.png" alt="High-Level Architecture of KAppMaker" height="500" />
</div>


## Detailed Architecture

The KAppMaker architecture consists of three main layers/packages (domain, data, presentation):

1. **[Domain](domain)**: Contains business logic, domain models and exceptions.
2. **[Data](data)**: Manages data sources, including user preferences and remote APIs and repositories.
3. **[Presentation](presentation)**: Contains UI components, theme (color, font), and screens. Each screen has its own UiState, UiEvent (user actions), and Composable Screen.
4. **[Navigation](navigation)**: Routes, the back-stack model, and the root `AppNavigation` composable. Lives at `presentation/navigation/`; feature folders stay free of navigation glue.
5. **Root**: Application entry point and initialization. `AppInitializer` contains startup logic and dependency injection setup.
6. **Util**: Utility classes, extensions.