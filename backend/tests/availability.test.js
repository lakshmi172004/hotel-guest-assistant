const request = require("supertest");
const app = require("../src/app");

describe("Availability API", () => {

    test("should return available rooms for valid request", async () => {

        const response = await request(app)
            .post("/api/availability")
            .send({
                checkIn: "2026-09-20",
                checkOut: "2026-09-22",
                adults: 3
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.rooms.length).toBeGreaterThan(0);
    });


    test("should reject missing check-in date", async () => {

        const response = await request(app)
            .post("/api/availability")
            .send({
                checkOut: "2026-09-22",
                adults: 2
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe(
            "Check-in date, check-out date, and number of guests are required."
        );
    });


    test("should reject invalid date order", async () => {

        const response = await request(app)
            .post("/api/availability")
            .send({
                checkIn: "2026-09-22",
                checkOut: "2026-09-20",
                adults: 2
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe(
            "Check-out date must be after check-in date."
        );
    });


    test("should reject zero guests", async () => {

        const response = await request(app)
            .post("/api/availability")
            .send({
                checkIn: "2026-09-20",
                checkOut: "2026-09-22",
                adults: 0
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe(
            "Please provide a valid number of guests."
        );
    });


    test("should reject too many guests", async () => {

        const response = await request(app)
            .post("/api/availability")
            .send({
                checkIn: "2026-09-20",
                checkOut: "2026-09-22",
                adults: 10
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe(
            "Sorry, we don't have a room that can accommodate 10 guest(s)."
        );
    });

});