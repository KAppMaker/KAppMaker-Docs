---
sidebar_position: 9
---

# UI Components
KAppMaker comes with already built in ready to use UI components.


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


