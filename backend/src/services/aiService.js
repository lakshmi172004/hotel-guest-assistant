const OpenAI = require("openai");


// Create OpenAI client only when an API key exists
const apiKey = process.env.OPENAI_API_KEY;

const client =
    apiKey && apiKey !== "your_api_key_here"
        ? new OpenAI({
            apiKey: apiKey
        })
        : null;


// Safe fallback response
function generateFallbackResponse(message, hotelData) {

    const guestMessage = message.toLowerCase().trim();


    if (
        guestMessage.includes("check-in") ||
        guestMessage.includes("check in") ||
        guestMessage.includes("arrival") ||
        guestMessage.includes("arrive")
    ) {
        return `Check-in time is ${hotelData.hotel.checkIn}.`;
    }


    if (
        guestMessage.includes("check-out") ||
        guestMessage.includes("check out") ||
        guestMessage.includes("departure") ||
        guestMessage.includes("leave")
    ) {
        return `Check-out time is ${hotelData.hotel.checkOut}.`;
    }


    if (
        guestMessage.includes("breakfast") ||
        guestMessage.includes("morning meal")
    ) {

        if (hotelData.hotel.breakfast.included) {
            return `Yes, breakfast is included. It is served from ${hotelData.hotel.breakfast.timing}.`;
        }

        return "Breakfast is not included.";
    }


    if (
        guestMessage.includes("swimming pool") ||
        guestMessage.includes("pool") ||
        guestMessage.includes("swim")
    ) {

        const hasPool = hotelData.hotel.amenities.some(
            (amenity) =>
                amenity.toLowerCase().includes("swimming pool")
        );

        if (hasPool) {
            return "Yes, the hotel has a swimming pool.";
        }

        return "The hotel does not currently list a swimming pool.";
    }


    if (
        guestMessage.includes("wifi") ||
        guestMessage.includes("wi-fi") ||
        guestMessage.includes("wi fi") ||
        guestMessage.includes("internet")
    ) {

        const hasWifi = hotelData.hotel.amenities.some(
            (amenity) =>
                amenity.toLowerCase().includes("wi-fi")
        );

        if (hasWifi) {
            return "Yes, free Wi-Fi is available for hotel guests.";
        }

        return "Wi-Fi information is not available.";
    }


    if (
        guestMessage.includes("cancel") ||
        guestMessage.includes("cancellation")
    ) {
        return hotelData.hotel.cancellationPolicy;
    }


    if (
        guestMessage.includes("hotel name") ||
        guestMessage.includes("name of the hotel")
    ) {
        return `The hotel is called ${hotelData.hotel.name}.`;
    }


    if (
        guestMessage.includes("amenities") ||
        guestMessage.includes("facilities") ||
        guestMessage.includes("what does the hotel have")
    ) {
        return `The hotel offers: ${hotelData.hotel.amenities.join(", ")}.`;
    }


    if (
        guestMessage.includes("room types") ||
        guestMessage.includes("what rooms")
    ) {

        const roomNames = hotelData.rooms
            .map((room) => room.name)
            .join(", ");

        return `The hotel has these room types: ${roomNames}.`;
    }


    return (
        "Sorry, I don't have enough reliable information " +
        "to answer that question. Please ask me about " +
        "check-in, check-out, breakfast, Wi-Fi, swimming pool, " +
        "cancellation, hotel facilities, or room information."
    );
}


// AI response
async function generateAIResponse(message, hotelData) {

    // If no API key is available, use safe fallback
    if (!client) {
        return generateFallbackResponse(message, hotelData);
    }


    try {

        const hotelInformation = JSON.stringify(
            hotelData,
            null,
            2
        );


        const response = await client.responses.create({

            model: "gpt-4o-mini",

            instructions: `
You are a hotel guest assistant.

Answer the guest's question using ONLY the hotel information provided below.

Do not invent hotel facilities, prices, policies, room information,
availability, or any other facts.

If the information is not available in the hotel data,
say that you do not have enough reliable information.

IMPORTANT:
- Do not check room availability yourself.
- Do not make booking decisions.
- Availability is handled separately by the backend.
- Be concise, friendly, and helpful.

Hotel information:
${hotelInformation}
`,

            input: message

        });


        return response.output_text;

    } catch (error) {

        console.error(
            "OpenAI API error:",
            error.message
        );


        // If AI service fails, use safe fallback
        return generateFallbackResponse(
            message,
            hotelData
        );
    }
}


module.exports = {
    generateAIResponse
};