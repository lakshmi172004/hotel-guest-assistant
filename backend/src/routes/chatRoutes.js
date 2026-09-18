const express = require("express");

const router = express.Router();

const { getHotelData } = require("../services/hotelService");
const { checkAvailability } = require("../services/availabilityService");
const { generateAIResponse } = require("../services/aiService");

const {
    getConversation,
    updateConversation
} = require("../services/conversationService");


// Convert different date formats into YYYY-MM-DD
function extractDate(message) {

    // Format: 2026-09-20
    const isoDateMatch = message.match(
        /\b(20\d{2})-(\d{2})-(\d{2})\b/
    );

    if (isoDateMatch) {
        return `${isoDateMatch[1]}-${isoDateMatch[2]}-${isoDateMatch[3]}`;
    }


    // Format: 20/09/2026 or 20-09-2026
    const numericDateMatch = message.match(
        /\b(\d{1,2})[\/-](\d{1,2})[\/-](20\d{2})\b/
    );

    if (numericDateMatch) {

        const day =
            numericDateMatch[1].padStart(2, "0");

        const month =
            numericDateMatch[2].padStart(2, "0");

        const year =
            numericDateMatch[3];

        return `${year}-${month}-${day}`;
    }


    // Format: September 20, 2026
    const monthDateMatch = message.match(
        /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:,?\s+(20\d{2}))?\b/i
    );

    if (monthDateMatch) {

        const monthNames = [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december"
        ];

        const month =
            monthNames.indexOf(
                monthDateMatch[1].toLowerCase()
            ) + 1;

        const day =
            monthDateMatch[2].padStart(2, "0");

        const year =
            monthDateMatch[3] ||
            new Date().getFullYear();

        return `${year}-${String(month).padStart(2, "0")}-${day}`;
    }

    return null;
}


// Detect check-in message
function isCheckInMessage(message) {

    return (
        message.includes("check-in") ||
        message.includes("check in") ||
        message.includes("arrive") ||
        message.includes("arrival")
    );
}


// Detect check-out message
function isCheckOutMessage(message) {

    return (
        message.includes("check-out") ||
        message.includes("check out") ||
        message.includes("leave") ||
        message.includes("departure")
    );
}


// Chat API
router.post("/chat", async (req, res) => {

    const {
        message,
        conversationId
    } = req.body;

    const hotel = getHotelData();


    // Validate message
    if (!message || message.trim() === "") {

        return res.status(400).json({
            error: "Message is required."
        });
    }


    // Create or use conversation ID
    const currentConversationId =
        conversationId || "default-conversation";


    const guestMessage =
        message.toLowerCase();


    // Extract number of guests
    const guestMatch =
        guestMessage.match(
            /(\d+)\s*(guest|guests|people|person)/
        );

    if (guestMatch) {

        updateConversation(
            currentConversationId,
            {
                adults: Number(guestMatch[1])
            }
        );
    }


    // Extract date
    const extractedDate =
        extractDate(message);


    if (extractedDate) {

        if (isCheckInMessage(guestMessage)) {

            updateConversation(
                currentConversationId,
                {
                    checkIn: extractedDate
                }
            );

        } else if (isCheckOutMessage(guestMessage)) {

            updateConversation(
                currentConversationId,
                {
                    checkOut: extractedDate
                }
            );

        } else {

            const latestConversation =
                getConversation(currentConversationId);


            if (!latestConversation.checkIn) {

                updateConversation(
                    currentConversationId,
                    {
                        checkIn: extractedDate
                    }
                );

            } else if (!latestConversation.checkOut) {

                updateConversation(
                    currentConversationId,
                    {
                        checkOut: extractedDate
                    }
                );
            }
        }
    }


    // Get updated conversation
    const updatedConversation =
        getConversation(currentConversationId);


    // Check whether guest is asking about availability
    if (
        guestMessage.includes("availability") ||
        guestMessage.includes("available") ||
        guestMessage.includes("book a room") ||
        guestMessage.includes("reserve a room") ||
        guestMessage.includes("reservation") ||
        guestMessage.includes("room for") ||
        guestMessage.includes("do you have a room")
    ) {


        const missingFields = [];


        if (!updatedConversation.checkIn) {

            missingFields.push(
                "check-in date"
            );
        }


        if (!updatedConversation.checkOut) {

            missingFields.push(
                "check-out date"
            );
        }


        if (!updatedConversation.adults) {

            missingFields.push(
                "number of guests"
            );
        }


        // Ask guest for missing information
        if (missingFields.length > 0) {

            return res.json({

                type: "availability_request",

                answer:
                    `Sure! I can help with that. Please provide your ${missingFields.join(
                        ", "
                    )}.`,

                requiredFields:
                    missingFields,

                conversationId:
                    currentConversationId
            });
        }


        // Check availability using deterministic backend logic
        const availabilityResult =
            checkAvailability(
                updatedConversation.checkIn,
                updatedConversation.checkOut,
                updatedConversation.adults
            );


        // Availability error
        if (!availabilityResult.success) {

            return res.json({

                type: "availability_result",

                answer:
                    availabilityResult.message,

                conversationId:
                    currentConversationId
            });
        }


        // Availability success
        return res.json({

            type: "availability_result",

            answer:
                `We found ${availabilityResult.rooms.length} suitable room type(s) for ${availabilityResult.adults} guest(s).`,

            availability:
                availabilityResult,

            conversationId:
                currentConversationId
        });
    }


    // Normal hotel question
    const aiResponse =
        await generateAIResponse(
            message,
            hotel
        );


    return res.json({

        type: "hotel_information",

        answer:
            aiResponse,

        conversationId:
            currentConversationId
    });
});


module.exports = router;