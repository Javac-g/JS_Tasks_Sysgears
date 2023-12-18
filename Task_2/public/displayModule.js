export function displayResults(data) {
    const resultsContainer = document.querySelector(".results-container");
    resultsContainer.innerHTML = '';

    const resultsArray = data.map(item => ({
        name: item.name,
        email: item.email,
    }));

    resultsArray.forEach(item => {
        const resultItem = document.createElement("div");
        resultItem.innerHTML = `Name: ${item.name}, Email: ${item.email}`;
        resultsContainer.appendChild(resultItem);
    });

    const resultJSON = {
        result: resultsArray,
    };

    console.log(resultJSON);
    return resultJSON;
}