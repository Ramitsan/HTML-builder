const path = require('path');
const fs = require('fs');
const { readdir, readFile, appendFile } = require('fs/promises');

const stylesDirName = 'styles';
const stylesDirPath = path.join(__dirname, stylesDirName);
const bundleDirName = 'project-dist';
const bundleFileName = 'bundle.css';
const bundleFilePath = path.join(__dirname, bundleDirName, bundleFileName);

function errorHandler(err) {
    if (err) return console.log(err.message);
}

async function getStyleFiles() {
    // метод fs.open() используется для создания нового файла
    // флаг w означает, что мы хотим открыть файл для записи
    fs.open(bundleFilePath, 'w', errorHandler);

    const files = await readdir(stylesDirPath, { withFileTypes: true });
   
    for (const file of files) {
        const { name } = file;
        const filePath = path.join(stylesDirPath, name);

        if (file.isFile() && path.extname(filePath) === '.css') {
            const data = await readFile(filePath, 'utf-8',  errorHandler); 
            await appendFile(bundleFilePath, data, errorHandler);         
        }
    }
}

async function start() {
    try {
        await getStyleFiles();
    } catch (err) {
        console.log(err.message);
    }
}

start().then(() => { console.log('ok') });
