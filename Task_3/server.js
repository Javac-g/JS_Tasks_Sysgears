
const http = require('http');
const { generateRandomCoordinates, calculateDistance } = require('./public/utils');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
       
        let probeCount = 0;
        const probeCoordinatesList = [];

        for (let attempt = 0; attempt < 100; attempt++) {
           
            const asteroidCoordinates = generateRandomCoordinates();

            
            let minX = 0;
            let minY = 0;
            let minZ = 0;
            let maxX = 100;
            let maxY = 100;
            let maxZ = 100;

            while (true) {
                const probeX = Math.floor((minX + maxX) / 2);
                const probeY = Math.floor((minY + maxY) / 2);
                const probeZ = Math.floor((minZ + maxZ) / 2);
                const probeCoordinates = { x: probeX, y: probeY, z: probeZ };

                const distanceToAsteroid = calculateDistance(probeCoordinates, asteroidCoordinates);

                probeCount++;
                probeCoordinatesList.push(probeCoordinates);

                if (distanceToAsteroid === 0) {
                    const asteroidLocation = probeCoordinates;
                    const result = {
                        location: asteroidLocation,
                        probes: {
                            count: probeCount,
                            coordinates: probeCoordinatesList,
                        },
                    };

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ result }));
                    return;
                } else if (probeCount >= 100) {
                    
                    break;
                } else {
                    if (probeCoordinates.x < asteroidCoordinates.x) {
                        minX = probeX + 1;
                    } else {
                        maxX = probeX - 1;
                    }
                    if (probeCoordinates.y < asteroidCoordinates.y) {
                        minY = probeY + 1;
                    } else {
                        maxY = probeY - 1;
                    }
                    if (probeCoordinates.z < asteroidCoordinates.z) {
                        minZ = probeZ + 1;
                    } else {
                        maxZ = probeZ - 1;
                    }
                }
            }
        }

        
        res.writeHead(404);
        res.end('Asteroid not found , try more');
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});