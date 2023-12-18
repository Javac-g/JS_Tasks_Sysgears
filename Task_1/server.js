const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const filePath = parsedUrl.pathname === '/' ? 'public/index.html' : `public${parsedUrl.pathname}`;
    const fileExtension = path.extname(filePath);

    if (fileExtension === '.html' || fileExtension === '.js' || fileExtension === '.css') {
       
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404 Not Found');
            } else {
                const contentType = {
                    '.html': 'text/html',
                    '.js': 'text/javascript',
                    '.css': 'text/css',
                }[fileExtension];

                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    } else if (fileExtension === '.json' && filePath === 'public/units.json') {
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    } else if (parsedUrl.pathname === '/updateUnits' && req.method === 'POST') {
        
        let requestBody = '';
        req.on('data', (chunk) => {
            requestBody += chunk.toString();
        });
        req.on('end', () => {
            try {
                const updatedData = JSON.parse(requestBody);
                
                writeFileAsync(path.join(__dirname, 'public', 'units.json'), JSON.stringify(updatedData, null, 2))
                    .then(() => {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end('Units updated successfully');
                    })
                    .catch((error) => {
                        console.error('Error writing to units.json:', error);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    });
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Bad Request');
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found');
    }
});

const port = 3000;

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
