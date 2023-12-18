const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        
        fs.readFile('questionnaire-config.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            
            const questionnaireConfig = JSON.parse(data);

            
            const paths = generateQuestionnairePaths(questionnaireConfig);

            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ paths }));
        });
    } else {
        
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


function generateQuestionnairePaths(config) {
    const questions = config.questions;
    const paths = [];

    function backtrack(path, currentIndex) {
        if (currentIndex === questions.length) {
            
            paths.push([...path]);
            return;
        }

        const currentQuestion = questions[currentIndex];
        const questionText = Object.keys(currentQuestion)[0];
        const options = currentQuestion[questionText];

        for (const option of options) {
            
            path.push({ [questionText]: option });
            backtrack(path, currentIndex + 1);
            path.pop();
        }
    }

    backtrack([], 0);

    return {
        number: paths.length,
        list: paths,
    };
}
