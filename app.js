// const http = require('http');
 
// const hostname = '0.0.0.0';
// const port = 3030;
 
// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });
 
// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

// const http = require('http');
// const os = require("os");
// const userInfo = os.userInfo();
// const uid = userInfo.uid;
// const name = userInfo.username;
// const hostname = '0.0.0.0';
// const port = 3030;
// const MongoClient = require("mongodb").MongoClient;
// const url = "mongodb://127.0.0.1:27017/";
// const mongoClient = new MongoClient(url);
// count = 0;
// async function run() {
// try {
// // Подключаемся к серверу
// await mongoClient.connect();
// // обращаемся к базе данных пользователя
// const db = mongoClient.db(`test1`);
// // выполняем пинг для проверки подключения
// const result = await db.command({ ping: 1 });
// console.log("Подключение с сервером успешно установлено");
// const collection = db.collection("users");
// count = await collection.countDocuments();
// console.log(`В коллекции users ${count} документа/ов`);
// console.log(result);
// }catch(err) {
// console.log("Возникла ошибка");
// console.log(err);
// } finally {
// // Закрываем подключение при завершении работы или при ошибке
// 3
// await mongoClient.close();
// console.log("Подключение закрыто");
// }
// }
// run().catch(console.error);
// const server = http.createServer((req, res) => {
// res.statusCode = 200;
// res.setHeader('Content-Type', 'text/plain');
// res.end(`Hello ${name}, you have ${count} documents` );
// });
// server.listen(port, hostname, () => {
// console.log(`Server running at http://${hostname}:${port}/`);
// });
// //А также на выбор используемой коллекции документов
// const collection = db.collection("users");
// count = await collection.countDocuments();
// console.log(`В коллекции users ${count} документа/ов`);

// Подключение необходимых модулей
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

// Загрузка переменных окружения из .env файла
dotenv.config();

// Инициализация приложения Express
const app = express();
const PORT = process.env.PORT || 3000; // Порт для прослушивания сервера

// Middleware для обработки JSON-тел запросов
app.use(express.json());

// URI для подключения к MongoDB. Используем переменную окружения.
// Если переменная не задана, используем локальный MongoDB по умолчанию.
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/?maxPoolSize=20&w=majority";

// Создание нового клиента MongoDB
// Опции useNewUrlParser и useUnifiedTopology устарели в новых версиях драйвера,
// но могут быть полезны для совместимости. ServerApiVersion v1 важен для MongoDB Atlas.
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    // useNewUrlParser: true, // Эти опции часто не нужны с ServerApiVersion
    // useUnifiedTopology: true // Эти опции часто не нужны с ServerApiVersion
});

// Переменная для хранения состояния подключения к базе данных
let isConnected = false;

// Асинхронная функция для подключения к MongoDB
async function connectToMongo() {
    try {
        await client.connect();
        isConnected = true;
        console.log('Успешное подключение к MongoDB!');
        // Открытие соединения с нужной базой данных при старте, если необходимо
        // const db = client.db('testdb');
        // console.log(`Подключены к базе данных: ${db.databaseName}`);
    } catch (err) {
        console.error('Ошибка подключения к MongoDB:', err);
        isConnected = false;
        // Можно добавить логику повторного подключения или завершения работы приложения
        // process.exit(1); // Завершить приложение при ошибке подключения
    }
}

// Вызов функции подключения при старте приложения
connectToMongo();

// Пример: маршрут для корневого URL
app.get('/', (req, res) => {
    res.send('Привет! Сервер работает.');
});

// Маршрут для проверки статуса подключения к базе данных
app.get('/status', (req, res) => {
    if (isConnected) {
        res.status(200).json({ status: 'connected', message: 'Сервер успешно подключен к MongoDB.' });
    } else {
        res.status(503).json({ status: 'disconnected', message: 'Сервер не подключен к MongoDB.' });
    }
});

// Маршрут для вставки данных
app.post('/insert', async (req, res) => {
    // Деструктурируем данные из тела запроса
    const { name, value, collectionName } = req.body;

    // Проверка, что сервер подключен к MongoDB
    if (!isConnected) {
        return res.status(503).json({ error: 'Сервер не подключен к базе данных.' });
    }

    // Подключаемся к базе данных 'testdb' (или имя вашей БД)
    // !!! ЗАМЕНИТЕ 'testdb' НА ИМЯ ВАШЕЙ БАЗЫ ДАННЫХ, ЕСЛИ ОНО ОТЛИЧАЕТСЯ !!!
    const db = client.db('testdb');

    // Выбираем коллекцию. Если collectionName не указан, используем 'myCollection'
    // !!! ЗАМЕНИТЕ 'myCollection' НА ИМЯ ВАШЕЙ КОЛЛЕКЦИИ ПО УМОЛЧАНИЮ, ЕСЛИ ОНО ОТЛИЧАЕТСЯ !!!
    const collection = db.collection(collectionName || 'myCollection');

    let count; // Объявляем переменную 'count'

    try {
        // Вставляем новый документ в коллекцию
        await collection.insertOne({ name, value, timestamp: new Date() });

        // Получаем обновленное количество документов в коллекции
        count = await collection.countDocuments();

        // Отправляем успешный ответ с количеством документов
        res.json({ message: 'Документ успешно добавлен!', count });
    } catch (e) {
        // Обработка ошибок при добавлении документа
        console.error("Ошибка при добавлении документа:", e);
        res.status(500).json({ error: 'Ошибка сервера при добавлении документа.' });
    }
});

// Маршрут для получения всех документов из коллекции
app.get('/getAll', async (req, res) => {
    const { collectionName } = req.query; // Получаем имя коллекции из параметров запроса

    if (!isConnected) {
        return res.status(503).json({ error: 'Сервер не подключен к базе данных.' });
    }

    const db = client.db('testdb'); // Ваша база данных
    const collection = db.collection(collectionName || 'myCollection'); // Ваша коллекция

    try {
        const documents = await collection.find({}).toArray();
        res.json(documents);
    } catch (e) {
        console.error("Ошибка при получении документов:", e);
        res.status(500).json({ error: 'Ошибка сервера при получении документов.' });
    }
});

// Маршрут для получения документа по имени
app.get('/getByName', async (req, res) => {
    const { name, collectionName } = req.query;

    if (!isConnected) {
        return res.status(503).json({ error: 'Сервер не подключен к базе данных.' });
    }

    const db = client.db('testdb');
    const collection = db.collection(collectionName || 'myCollection');

    try {
        const document = await collection.findOne({ name: name });
        if (document) {
            res.json(document);
        } else {
            res.status(404).json({ message: 'Документ не найден.' });
        }
    } catch (e) {
        console.error("Ошибка при получении документа по имени:", e);
        res.status(500).json({ error: 'Ошибка сервера при получении документа по имени.' });
    }
});

// Запуск сервера Express
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    // Если вам нужно открыть что-то в браузере автоматически, можно добавить:
    // const open = require('open');
    // open(`http://localhost:${PORT}`);
});

// Обработка сигнала завершения процесса (Ctrl+C)
process.on('SIGINT', async () => {
    console.log('Получен сигнал SIGINT. Завершение работы...');
    if (isConnected) {
        await client.close();
        console.log('Соединение с MongoDB закрыто.');
    }
    process.exit(0);
});

// Обработка необработанных исключений
process.on('unhandledRejection', (reason, promise) => {
    console.error('Необработанное отклонение:', reason);
    // Дополнительная обработка ошибок
});

// Обработка неперехваченных исключений
process.on('uncaughtException', err => {
    console.error('Неперехваченное исключение:', err);
    // Для production приложений обычно рекомендуется завершить процесс
    // process.exit(1);
});
