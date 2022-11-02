const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdin, stdout } = process;

let fileName = 'text.txt';
let filePath = path.join(__dirname, fileName);

const errorHandler = (err) => {
    if (err) throw err;
}

const fileHandler = () => {
    // метод fs.open() используется для создания нового файла
    // флаг w означает, что мы хотим открыть файл для записи
    fs.open(filePath, 'w', errorHandler);

    let text = stdout.write('Введите текст\n');
    text = text.toString('utf-8');

    stdin.on('data', text => {
        // Метод .appendFile() используется для добавления данных в конец существующего файла. 
        // Первый аргумент - имя файла, второй - данные, которые нужно добавить в конец файла.  
        fs.appendFile(filePath, text, errorHandler);
    });   
    
    process.on('exit', () => console.log('Всего хорошего!'));
    // process.on('exit', () => stdout.write('Всего хорошего!'));  
}

fileHandler();

