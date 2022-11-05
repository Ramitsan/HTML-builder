const path = require('path');
const fs = require('fs');
const { readdir, mkdir, unlink, copyFile, rmdir } = require('fs/promises');

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

    for (const file of files) {
        const { name } = file;

        const currentFile = path.join(dirPath, name);
        const copyFile2 = path.join(dirPathCopy, name);

        await copyFile(currentFile, copyFile2);
    }
}

async function removeDir() {
    const files = await readdir(dirPathCopy, { withFileTypes: true });

    for (const file of files) {
        const { name } = file;
        const filePath = path.join(dirPathCopy, name);
        // удаляем файлы 
        await unlink(filePath);
    }
    //  затем удаляем папку полностью
    try {
        await rmdir(dirPathCopy);
    }
    catch (err) {
        if (err) console.log('Папка не удалена');
    }
    console.log('Папка успешно удалена');
}

async function createDir() {
    return new Promise((res, rej) => {
        // проверяем, существует ли директория
        fs.access(dirPathCopy, async (err) => {
            try {
                //если не существует
                if (err && err.code === 'ENOENT') {
                    // создаем каталог 
                    await copyDir(dirPath, dirPathCopy);

                    //если существует
                } else {
                    await removeDir();
                    await copyDir(dirPath, dirPathCopy);
                }
                res();
            }
            catch (err) {
                rej(err);
            }

        })
    })

}

async function start() {
    try {
        await createDir();
    } catch (err) {
        console.log(err.message);
    }
}

start().then(() => { console.log('ok') });



