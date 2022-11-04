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

    files.forEach(file => {
        const { name } = file;
        const filePath = path.join(dirPath, name);

        if (file.isFile()) {
            stat(filePath, (err, file) => {
                if (err) return console.log(err.message);

                const fileName = name.split('.')[0];
                const fileExtension = path.extname(filePath).slice(1);
                const fileSize = file.size;

                return console.log(`${fileName} - ${fileExtension} - ${fileSize} b`);
            })
        }
    })
}


try {
    getInfoAboutFiles();
} catch (err) {
    console.log(err.message);
}
