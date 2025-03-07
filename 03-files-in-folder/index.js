const path = require('path');
const { readdir } = require('fs/promises');
const { stat } = require('fs');

const dirName = 'secret-folder';
const dirPath = path.join(__dirname, dirName);

async function getInfoAboutFiles() {
    // функция readdir позволяет получить имена всех файлов, 
    // находящихся в данной директории
    // withFileTypes: true в дальнейшем позволит узнать тип элемента (папка или файл) 
    const files = await readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
        const { name } = file;
        const filePath = path.join(dirPath, name);

        if (file.isFile()) {
            await new Promise((res, rej) => {
                stat(filePath, (err, file) => {
                    try {
                        if (err) throw err;

                        const fileName = name.split('.')[0];
                        const fileExtension = path.extname(filePath).slice(1);
                        const fileSize = file.size;

                        console.log(`${fileName} - ${fileExtension} - ${fileSize} b`);
                        res(null);
                    }
                    catch (err) {
                        rej(err);
                    }
                })
            })
        }
    }

}

async function start() {
    try {
        await getInfoAboutFiles();
    } catch (err) {
        console.log(err.message);
    }
}

start().then(() => { console.log('ok') });
