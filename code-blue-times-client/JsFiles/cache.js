const fs = require('fs');
const path = require('path');
const directoryPath = '../';
///JsFiles\/.*\.js/g, , , /css/CSSFilesForHtmlPages\/.*\.css/g,/css\/.*\.css/g ,/JsFiles/JsfilesForhtmlPages\/.*\.js/g
function addCacheBustingQueryParams(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const timestamp = Date.now();
    const regexPattern = "versioncontrol=\\d+";
    const flags = 'g';
    const regex = new RegExp(regexPattern, flags);

    fs.writeFileSync(filePath, content.replace(regex, `versioncontrol=${timestamp}`, 'utf8'))
    console.log('hi');
}

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }
    const htmlFiles = files.filter((file) => path.extname(file).toLowerCase() === '.html');
    htmlFiles.forEach((htmlFile) => {
        addCacheBustingQueryParams(path.join('./', htmlFile));
    })
})
