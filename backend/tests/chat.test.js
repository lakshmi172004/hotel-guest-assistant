const request = require("supertest");
const app = require("../src/app");

describe("Chat API", () => {

    test("should answer check-in time question", async () => {

        const response = await request(app)
            .post("/api/chat")
            .send({
                message: "What time is check-in?",
                conversationId: "test-check-in"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.type).toBe("hotel_information");
        expect(response.body.answer).toContain("2:00 PM");
    });


    test("should answer check-out time question", async () => {

        const response = await request(app)
            .post("/api/chat")
            .send({
                message: "What time is check-out?",
                conversationId: "test-check-out"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.type).toBe("hotel_information");
        expect(response.body.answer).toContain("11:00 AM");
    });


    test("should answer breakfast question", async () => {

        const response = await request(app)
            .post("/api/chat")
            .send({
                message: "Is breakfast included?",
                conversationId: "test-breakfast"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.type).toBe("hotel_information");
        expect(response.body.answer).toContain("breakfast");
    });


    test("should answer swimming pool question", async () => {

        const response = await request(app)
            .post("/api/chat")
            .send({
                message: "Does the hotel have a swimming pool?",
                conversationId: "test-pool"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.type).toBe("hotel_information");
        expect(response.body.answer).toContain("swimming pool");
    });


    test("should reject an empty message", async () => {

        const response = await request(app)
            .post("/api/chat")
            .send({
                message: "",
                conversationId: "test-empty"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(
            "Message is required."
        );
    });


    test("should provide a safe fallback for unsupported questions", async () => {

        const response = await request(app)
            .post("/api/chat")
            .send({
                message: "What is the nearest space station?",
                conversationId: "test-unsupported"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.type).toBe(
            "hotel_information"
        );

        expect(response.body.answer).toContain(
            "enough reliable information"
        );
    });


    test("should ask for missing information for availability", async () => {

        const response = await request(app)
            .post("/api/chat")
            .send({
                message: "I need a room for 3 guests",
                conversationId: "test-missing-info"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.type).toBe(
            "availability_request"
        );

        expect(response.body.requiredFields).toContain(
            "check-in date"
        );

        expect(response.body.requiredFields).toContain(
            "check-out date"
        );
    });


    test("should maintain conversation context for availability", async () => {

        const conversationId = "test-conversation-context";

        await request(app)
            .post("/api/chat")
            .send({
                message: "I need a room for 3 guests",
                conversationId: conversationId
            });

        await request(app)
            .post("/api/chat")
            .send({
                message: "September 20",
                conversationId: conversationId
            });

        await request(app)
            .post("/api/chat")
            .send({
                message: "September 22",
                conversationId: conversationId
            });

        const response = await request(app)
            .post("/api/chat")
            .send({
                message: "Check availability",
                conversationId: conversationId
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.type).toBe(
            "availability_result"
        );

        expect(response.body.availability).toBeDefined();

        expect(
            response.body.availability.rooms.length
        ).toBeGreaterThan(0);
    });


    test("should handle room capacity correctly", async () => {

        const response = await request(app)
            .post("/api/chat")
            .send({
                message: "I need a room for 10 guests",
                conversationId: "test-capacity"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.type).toBe(
            "availability_request"
        );
    });


    test("should return a conversation ID", async () => {

        const response = await request(app)
            .post("/api/chat")
            .send({
                message: "Do you have free Wi-Fi?",
                conversationId: "test-id"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.conversationId).toBe(
            "test-id"
        );
    });

});