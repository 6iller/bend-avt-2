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

const http = require('http');
const os = require("os");
const userInfo = os.userInfo();
const uid = userInfo.uid;
const name = userInfo.username;
const hostname = '0.0.0.0';
const port = 3030;
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);
count = 0;
async function run() {
try {
// Подключаемся к серверу
await mongoClient.connect();
// обращаемся к базе данных пользователя
const db = mongoClient.db(`test1`);
// выполняем пинг для проверки подключения
const result = await db.command({ ping: 1 });
console.log("Подключение с сервером успешно установлено");
const collection = db.collection("users");
count = await collection.countDocuments();
console.log(`В коллекции users ${count} документа/ов`);
console.log(result);
}catch(err) {
console.log("Возникла ошибка");
console.log(err);
} finally {
await mongoClient.close();
console.log("Подключение закрыто");
}
}
run().catch(console.error);

const server = http.createServer((req, res) => {
res.statusCode = 200;
res.setHeader('Content-Type', 'text/plain');
res.end(`Hello ${name}, you have ${count} documents` );
});
server.listen(port, hostname, () => {
console.log(`Server running at http://${hostname}:${port}/`);
});

const collection = db.collection("users");
count = await collection.countDocuments();
console.log(`В коллекции users ${count} документа/ов`);