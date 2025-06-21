---
sidebar_position: 9
---

# UI Components
KAppMaker comes with already built in to use UI components. These components are located in `designsystem` module. Also Compose Hot Reload feature is enabled to iterate quickly. You can see all available components in `AllComponentsGallery.kt` file located in `designsystem` module. In `designsystem/jvmMain` there is `Main.kt` file. When you run it you can see and search all reusable components, also it supports hot reload, meaning if you change something in component you can see changes. 

![All UI Components](/img/all_ui_components.png).   
![UI Components](/img/ui_components_1.png)    


### Native Dialog
In Android it shows AlertDialog, and in ios it shows UIAlerts.
![Native Dialog](/img/feat_nativedialog.png)  

```kotlin
NativeAlertDialog(
    title = "Dialog Title",
    text = "Dialog body text",
    btnConfirmText = "Ok",
    btnDismissText = "Dismiss",
    onConfirm = {},
    onDismiss = {},
)
```


## How to access resources

- For accessing resources in `designsystem` module, such as icons, texts you can use `UiRes.drawable.your_icon` or `UiRes.string.your_text`. For accessing resources in app module instead of `UiRes` just simply access with `Res` (ex: `Res.drawable.your_icon`. For simplicity you can even place all of your icons and string resources in `designsytem` module. This will make very easy for you to support multiple languages.



### Extra useful tip

If you are working on new UI component, you can replace `AllComponentsGallery`  with your own component to quickly build that new UI component.

```kotlin
//designsystem/src/jvmMain/kotlin/Main.kt
fun main() {
    singleWindowApplication(title = "All Components Gallery", alwaysOnTop = true) {
        AllComponentsGallery() // <-- replace this with your own component if you want focus on one component
    }
}
```


