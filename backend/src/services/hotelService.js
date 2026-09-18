const fs = require("fs");
const path = require("path");

const hotelDataPath = path.join(__dirname, "../../data/hotel.json");

function getHotelData() {
    const data = fs.readFileSync(hotelDataPath, "utf-8");
    return JSON.parse(data);
}

module.exports = {
    getHotelData
};