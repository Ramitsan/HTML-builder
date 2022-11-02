const fs = require('fs');
const path = require('path');

let fileName = 'text.txt';
let filePath = path.join(__dirname, fileName);
let readableStream = fs.createReadStream(filePath, 'utf-8');

// У потока чтения есть событие data, которое генерируется, 
// когда стрим прочитал порцию данных и готов отдать ее потребителю этих данных.
let data = '';
readableStream.on('data', chunk => console.log(data += chunk));

// При возникновении ошибки будет сгенерировано событие error
readableStream.on('error', error => console.log('Error', error.message));

// Также у потока чтения есть событие 'end'. Это событие срабатывает, когда все данные уже переданы.
readableStream.on('end', () => console.log('End. Data length:', data.length));