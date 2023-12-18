let data; 

function loadJSON(callback) {
    fetch('units.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            data = jsonData; 
            callback(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


loadJSON(function (jsonData) {
    const units = jsonData.units;
    const fromSelect = document.getElementById("distanceFrom");
    const toSelect = document.getElementById("distanceTo");

    
    units.forEach(unit => {
        const option = document.createElement("option");
        option.value = unit.abbreviation;
        option.textContent = `${unit.name} (${unit.abbreviation})`;

        fromSelect.appendChild(option.cloneNode(true));
        toSelect.appendChild(option);
    });
});

function convertDistance() {
    const value = parseFloat(document.getElementById("distanceValue").value);
    const fromUnit = document.getElementById("distanceFrom").value;
    const toUnit = document.getElementById("distanceTo").value;

    const inputObject = {
        distance: {
            unit: fromUnit,
            value: value,
        },
        convertTo: toUnit,
    };

    const result = performDistanceConversion(inputObject); 
    console.log(result);

    if (result.error) {
        document.getElementById("distanceResult").innerHTML = `Error: ${result.error}`;
    } else {
        document.getElementById("distanceResult").innerHTML = getResultString(value, fromUnit, result.value, toUnit);
    }
}


function performDistanceConversion(input) {
    const units = data.units; 
    const fromUnit = input.distance.unit;
    const toUnit = input.convertTo;

    const fromConversionFactor = units.find(unit => unit.abbreviation === fromUnit)?.conversionToMeter;
    const toConversionFactor = units.find(unit => unit.abbreviation === toUnit)?.conversionToMeter;

    if (fromConversionFactor && toConversionFactor) {
        const convertedValue = (input.distance.value * fromConversionFactor) / toConversionFactor;
        return {
            unit: toUnit,
            value: convertedValue,
        };
    } else {
        return { error: 'Unsupported units or invalid input' };
    }
}


function getResultString(value, fromUnit, convertedValue, toUnit) {
    return `Result: ${value} ${fromUnit} is equal to ${convertedValue.toFixed(2)} ${toUnit}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const addUnitForm = document.getElementById('addUnitForm');
    addUnitForm.addEventListener('submit', addNewUnit);
});

function addNewUnit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const abbreviation = document.getElementById('abbreviation').value;
    const conversionFactor = parseFloat(document.getElementById('conversionFactor').value);

   
    const newUnit = {
        name: name,
        abbreviation: abbreviation,
        conversionToMeter: conversionFactor,
    };

    
    data.units.push(newUnit);

    updateJSONFile(data)
        .then(() => {
            
            loadUnitsAndUpdateSelectOptions();

            
            clearFormFields();

            
            displaySuccessMessage('Unit added successfully!');
        })
        .catch((error) => {
            console.error('Error updating JSON file:', error);
            displayErrorMessage('Failed to add unit. Please try again later.');
        });
}

function updateJSONFile(updatedData) {
    return fetch('/updateUnits', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    });
}

function loadUnitsAndUpdateSelectOptions() {
   fetch('units.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(updatedData => {
            
            data = updatedData;

            
            const fromSelect = document.getElementById("distanceFrom");
            const toSelect = document.getElementById("distanceTo");
            fromSelect.innerHTML = '';
            toSelect.innerHTML = '';

            data.units.forEach(unit => {
                const option = document.createElement("option");
                option.value = unit.abbreviation;
                option.textContent = `${unit.name} (${unit.abbreviation})`;

                fromSelect.appendChild(option.cloneNode(true));
                toSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function clearFormFields() {
    document.getElementById('name').value = '';
    document.getElementById('abbreviation').value = '';
    document.getElementById('conversionFactor').value = '';
}

function displaySuccessMessage(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.color = 'green';
}

function displayErrorMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
}