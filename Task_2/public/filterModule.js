

export function filterData(data, include, exclude, filterType) {
    return data.filter(item => {
        const nameMatches = include.some(filter => item.name === filter.name);
        const emailMatches = include.some(filter => item.email === filter.email);

        
        const allConditionsMatch = include.every(filter => {
            return (filter.name ? item.name === filter.name : true) &&
                (filter.email ? item.email === filter.email : true);
        });

    
        const isExcluded = exclude.some(filter => item.name === filter.name || item.email === filter.email);

        if (filterType === "or") {
          
            return (nameMatches || emailMatches) && !isExcluded;
        } else {
            
            return allConditionsMatch && !isExcluded;
        }
    });
}
