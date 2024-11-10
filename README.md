# Ozon price handler

## Установка

На запускаемой машине должна соять [nodejs](https://nodejs.org/en), далее в проекте запустить команду,
для установки зависимостей:

```
npm install
```

## Конфигурация

Для конфигурации нужно открыть `ozon-bot.js` и выставить константы:

- linkToWatch: ссылка для наблюдения за товаром
- targetPrice: целевая цена покупки, когда цена упадёт ниже или равной этой, бот купит товар по ссылке

## Использование

Чтобы подключить бота к своему браузеру (а это нужно для обхода подозрения озона)
нужно вставить в `cmd` эту команду для запуска браузера (edge) в дебаг-моде:

```
Start-Process msedge -ArgumentList '--remote-debugging-port=9222', '--user-data-dir=C:\ozon-bot'
```

Далее запускаем основной скрипт бота:

```
node ozon-bot.js
```

## Лицензия

Этот проект распространяется под MIT лицензией. Использование данного софта разрешается исключительно в образовательных целях. Все действия с использованием этого инструмента должны быть выполнены в рамках законодательства. Владелец не несет ответственности за использование данного софта.