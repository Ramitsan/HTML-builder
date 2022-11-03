const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdin, stdout } = process;

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);
const startMessage = 'Hello!\nPlease, enter text:\n';
const finalMessage = 'Goodbye!';

const errorHandler = (err) => {
    if (err) throw err;
}

const fileHandler = () => {
    // метод fs.open() используется для создания нового файла
    // флаг w означает, что мы хотим открыть файл для записи
    fs.open(filePath, 'w', errorHandler);

    stdout.write(startMessage);

    stdin.on('data', data => {
        data = data.toString('utf-8').trim();

        if (data === 'exit') {
            stdout.write(finalMessage);
            process.exit();

        } else {
            data += '\n';
            // Метод .appendFile() используется для добавления данных в конец существующего файла. 
            // Первый аргумент - имя файла, второй - данные, которые нужно добавить в конец файла.             
            fs.appendFile(filePath, data, errorHandler);
        }
    });

    process.on('SIGINT', () => {
        console.log(finalMessage);
        process.exit();
    })
}

fileHandler();
