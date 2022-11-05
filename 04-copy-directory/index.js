const path = require('path');
const fs = require('fs');
const { readdir, mkdir } = require('fs/promises');

const dirName = 'files';
const dirNameCopy = 'files-copy';
const dirPath = path.join(__dirname, dirName);
const dirPathCopy = path.join(__dirname, dirNameCopy);

function errorHandler(err) {
    if (err) return console.log(err.message);
}

async function copyDir(dirPath, dirPathCopy) {
    // создаем директорию
    await mkdir(dirPathCopy, { recursive: true }, errorHandler);

    // считываем файлы из исходной директории и копируем в новую
    const files = await readdir(dirPath, { withFileTypes: true }, errorHandler);
    files.forEach(file => {
        const { name } = file;

        const currentFile = path.join(dirPath, name);
        const copyFile = path.join(dirPathCopy, name);

        fs.copyFile(currentFile, copyFile, errorHandler);
    })
}

async function removeDir() {     
    const files = await readdir(dirPathCopy, { withFileTypes: true }, errorHandler);
   
    files.forEach(file => {
        const { name } = file;
        const filePath = path.join(dirPathCopy, name);
        // удаляем файлы 
        fs.unlink(filePath, errorHandler);
    })

    //  затем удаляем папку полностью
    // fs.rmdir(dirPathCopy, err => {
    //     if (err) console.log('Папка не удалена');
    //     console.log('Папка успешно удалена');
    // });
}

async function createDir() {
    // проверяем, существует ли директория
    fs.access(dirPathCopy, (err) => {

        //если не существует
        if (err && err.code === 'ENOENT') {
            // создаем каталог 
            copyDir(dirPath, dirPathCopy);

            //если существует
        } else {
            removeDir();
            copyDir(dirPath, dirPathCopy);
        }
    })
}

try {
    createDir();
} catch (err) {
    console.log(err.message);
}



