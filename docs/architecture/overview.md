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

1. **Domain**: Contains business logic, domain models and exceptions.
2. **Data**: Manages data sources, including user preferences and remote APIs and repositories.
3. **Presentation**: Contains UI components, screens, theme (color, font). Each screen has its own UiState, UiEvent (like user actions), Composable Screen and Navigation for that screen.
4. **Root**: This contains entry point for the application, and initialization. `AppInitializer` contains initialization and dependency injection setup.
5. **Util**: Utility classes, extensions.