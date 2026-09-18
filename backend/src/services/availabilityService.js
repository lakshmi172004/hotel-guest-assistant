const { getHotelData } = require("./hotelService");


function checkAvailability(checkIn, checkOut, adults) {

    const hotel = getHotelData();


    // Check required fields
    if (!checkIn || !checkOut || adults === undefined || adults === null || adults === "") {

        return {
            success: false,
            message: "Check-in date, check-out date, and number of guests are required."
        };

    }


    // Validate number of guests
    if (!Number.isInteger(Number(adults)) || Number(adults) < 1) {

        return {
            success: false,
            message: "Please provide a valid number of guests."
        };

    }


    // Convert dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);


    // Validate dates
    if (
        isNaN(checkInDate.getTime()) ||
        isNaN(checkOutDate.getTime())
    ) {

        return {
            success: false,
            message: "Please provide valid check-in and check-out dates."
        };

    }


    // Check date order
    if (checkOutDate <= checkInDate) {

        return {
            success: false,
            message: "Check-out date must be after check-in date."
        };

    }


    // Find rooms that can accommodate the guests
    const availableRooms = hotel.rooms.filter(
        (room) => room.capacity >= Number(adults)
    );


    // No suitable room
    if (availableRooms.length === 0) {

        return {
            success: false,
            message: `Sorry, we don't have a room that can accommodate ${adults} guest(s).`
        };

    }


    // Successful response
    return {
        success: true,
        checkIn: checkIn,
        checkOut: checkOut,
        adults: Number(adults),
        rooms: availableRooms
    };

}


module.exports = {
    checkAvailability
};