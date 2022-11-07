const path = require('path');
const fs = require('fs');
const { readdir, mkdir, readFile, appendFile, copyFile, writeFile } = require('fs/promises');

// папка проекта
const projectDirName = 'project-dist';
const projectDirPath = path.join(__dirname, projectDirName);

// папка с исходниками стилей
const originalStylesDirName = 'styles';
const originalStylesDirPath = path.join(__dirname, originalStylesDirName);

// итоговый файл со стилями
const bundleStylesFileName = 'style.css';
const bundleStylesFilePath = path.join(__dirname, projectDirName, bundleStylesFileName);

// исходная папка assets
const assetsDirName = 'assets';
const originalAssetsDirPath = path.join(__dirname, assetsDirName);
// итоговая папка assets
const copyAssetsDirPath = path.join(__dirname, projectDirName, assetsDirName);

// папка с компонентами html
const componentsDirName = 'components';
const componentsDirPath = path.join(__dirname, componentsDirName);

// итоговый файл index.html
const indexHtmlFileName = 'index.html';
const indexHtmlFilePath = path.join(__dirname, projectDirName, indexHtmlFileName);

function errorHandler(err) {
    if (err) return console.log(err.message);
}

// Создаём папку project-dist
async function createProjectDist() {
    await mkdir(projectDirPath, { recursive: true }, errorHandler);
}

// функция для копирования вложенных директорий
async function copyDir(currentDir, newDir) {
    await mkdir(newDir, { recursive: true }, errorHandler);

    // если есть вложенные файлы
    // считываем файлы из исходной директории и копируем в новую
    const files = await readdir(currentDir, { withFileTypes: true }, errorHandler);

    for (const file of files) {
        const { name } = file;

        const currentFilePath = path.join(currentDir, name);
        const copyFilePath = path.join(newDir, name);

        await copyFile(currentFilePath, copyFilePath);
    }
}

// Собираем в единый файл стили из папки styles 
// и помещаем их в файл project-dist/style.css
async function createStyleFile() {
    // метод fs.open() используется для создания нового файла
    // флаг w означает, что мы хотим открыть файл для записи
    fs.open(bundleStylesFilePath, 'w', errorHandler);

    const files = await readdir(originalStylesDirPath, { withFileTypes: true });

    for (const file of files) {
        const { name } = file;
        const filePath = path.join(originalStylesDirPath, name);

        if (file.isFile() && path.extname(filePath) === '.css') {
            const data = await readFile(filePath, 'utf-8', errorHandler);
            await appendFile(bundleStylesFilePath, data, errorHandler);
        }
    }
}

// Копируем папку assets в project-dist/assets
async function copyAssetsDir() {
    // в папке project-dist создаем директорию assets
    await mkdir(copyAssetsDirPath, { recursive: true }, errorHandler);

    // считываем файлы из исходной директории и копируем в новую
    const files = await readdir(originalAssetsDirPath, { withFileTypes: true }, errorHandler);

    for (const file of files) {
        const { name } = file;

        const currentFilePath = path.join(originalAssetsDirPath, name);
        const copyFilePath = path.join(copyAssetsDirPath, name);

        if (file.isDirectory()) {
            await copyDir(currentFilePath, copyFilePath, errorHandler);
        } else {
            await copyFile(currentFilePath, copyFilePath, errorHandler);
        }
    }
}

// создаем index.html и копируем в него разметку из компонентов
async function createIndexHtml() {
    const files = await readdir(__dirname, { withFileTypes: true }, errorHandler);

    for (const file of files) {
        const { name } = file;
        const filePath = path.join(__dirname, name);
        
        if (file.isFile() && path.extname(filePath) === '.html') {
            // копируем содержимое template.html в index.html
            const data = await readFile(filePath, 'utf-8', errorHandler);
            await appendFile(indexHtmlFilePath, data, errorHandler);
        }
    }

    // находим компоненты и добавляем их в разметку index.html
    const components = await readdir(componentsDirPath, errorHandler);
    let template = await readFile(indexHtmlFilePath, 'utf8');

    for (let component of components) {
        const componentFilePath = path.join(componentsDirPath, component);
    
        // path.parse() преобразует путь в объект, свойства которого представляют отдельные части пути
        const fileInfo = path.parse(component);
        const componentName = fileInfo.name;
        
        let data = await readFile(componentFilePath, 'utf-8');        
        template = template.replace(`{{${componentName}}}`, data);    
    }

    // записываем информацию в index.html
    const stream = fs.createWriteStream(indexHtmlFilePath);
    stream.write(template, 'utf-8');
    stream.end();
}

async function start() {
    try {
        await createProjectDist();
        await createStyleFile();
        await copyAssetsDir();
        await createIndexHtml();
    } catch (err) {
        console.log(err.message);
    }
}

start().then(() => { console.log('ok') });