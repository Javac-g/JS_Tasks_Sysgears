export function sortData(data, sortBy) {
    return data.slice().sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'email') {
            return a.email.localeCompare(b.email);
        }
        return 0;
    });
}