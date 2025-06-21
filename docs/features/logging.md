---
sidebar_position: 15
---

# Logging

You can log errors, info, debug messages using `AppLogger`. By default console logs will be turned off for relase builds.

## How To Use

```kotlin

AppLogger.i("Info message")
AppLogger.e("Error message", throwable)
AppLogger.d("Debug message")

```

## Optional Telegram Logger.
Although Firebase Crashlytics was already integrated, solo developers sometimes forget to check it regularly. With optional Telegram Bot logging, you’ll be instantly notified when an error occurs, to fix issues quickly. 

![Telegram Bot](/img/telegram_bot.png)



How to enable it:

Make sure you update your telegram bot token and chat id in `TelegramLogger` file in `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` fields. By default they are empty, if they have empty values, then TelegramLogger will not be used.  How to get these values:

To get your Telegram Bot Token:

1. Open Telegram app and search for the user "@BotFather".
2. Start a chat and send the command /newbot.
3. Follow the instructions to name your bot and get a unique bot username.
4. BotFather will provide you with the Bot Token (a long string) after creation.

To get your Telegram Chat ID:
1. Add your bot to a Telegram group or chat where you want to receive messages.
2. Alternatively, start a direct chat with your bot.
3. To find the chat ID, send a message to the bot or group.
4. Use the Telegram API or a tool like `https://api.telegram.org/bot<YourBotToken>/getUpdates` to fetch updates and find the `"chat":{"id": ... }` value corresponding to your chat.


Save your Bot Token and Chat ID in `TelegramLogger` file in `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` fields to enable sending messages.

Now iff you log with error or info message, it will be sent to telegram bot that you created. 
`AppLogger.i("Some info message")`. You will get info in your telegram bot.


        




















