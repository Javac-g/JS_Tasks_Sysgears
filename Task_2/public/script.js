
import { data } from './data.js';
import { filterData } from './filterModule.js';
import { sortData } from './sortModule.js';
import { displayResults } from './displayModule.js';


const userForm = document.getElementById("userForm");

userForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const excludeNameInput = document.getElementById("excludeName");
    const excludeEmailInput = document.getElementById("excludeEmail");
    const sortBySelect = document.getElementById("sortBy");
    const filterTypeSelect = document.getElementById("filterType"); 
    const includeFilters = [
        { name: nameInput.value },
        { email: emailInput.value },
    ];

    const excludeFilters = [
        { name: excludeNameInput.value, email: excludeEmailInput.value },
    ];

    const filterCondition = {
        include: includeFilters,
        exclude: excludeFilters,
        sortBy: sortBySelect.value,
        filterType: filterTypeSelect.value, 
    };

    
    const filteredData = filterData(data.data, includeFilters, excludeFilters, filterCondition.filterType);

   
    const sortedData = sortData(filteredData, filterCondition.sortBy);

   
    displayResults(sortedData);
});
