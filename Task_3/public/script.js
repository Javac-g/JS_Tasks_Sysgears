
const apiUrl = 'http://localhost:3000/data'; 
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        
        const asteroidLocationElement = document.getElementById('asteroidLocation');
        const totalProbesElement = document.getElementById('totalProbes');
        const probeListElement = document.getElementById('probeList');

       
        const asteroidLocation = data.result.location;
        const probeCount = data.result.probes.count;
        const probeCoordinates = data.result.probes.coordinates;

        
        asteroidLocationElement.textContent = `Location: (x: ${asteroidLocation.x}, y: ${asteroidLocation.y}, z: ${asteroidLocation.z})`;

        
        totalProbesElement.textContent = `Total Probes: ${probeCount}`;

        
        probeCoordinates.forEach(coordinate => {
            const listItem = document.createElement('li');
            listItem.textContent = `x: ${coordinate.x}, y: ${coordinate.y}, z: ${coordinate.z}`;
            probeListElement.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
