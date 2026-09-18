const express = require("express");
const cors = require("cors");

const { getHotelData } = require("./services/hotelService");
const chatRoutes = require("./routes/chatRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"]
    })
);

app.use(express.json());

app.get("/api/hotel", (req, res) => {
    const hotel = getHotelData();
    res.json(hotel);
});

app.use("/api", chatRoutes);
app.use("/api", availabilityRoutes);

module.exports = app;