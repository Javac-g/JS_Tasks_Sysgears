
function generateRandomCoordinates() {
    const randomCoordinate = () => Math.floor(Math.random() * 101);
    return {
        x: randomCoordinate(),
        y: randomCoordinate(),
        z: randomCoordinate(),
    };
}

function calculateDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    const dz = point1.z - point2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}


module.exports = {
    generateRandomCoordinates,
    calculateDistance,
};
