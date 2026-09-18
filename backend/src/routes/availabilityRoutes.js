const express = require("express");

const router = express.Router();

const { checkAvailability } = require("../services/availabilityService");


router.post("/availability", (req, res) => {

    const { checkIn, checkOut, adults } = req.body;


    const result = checkAvailability(
        checkIn,
        checkOut,
        adults
    );


    // If validation fails, return HTTP 400
    if (!result.success) {

        return res.status(400).json(result);

    }


    // If validation succeeds, return HTTP 200
    return res.status(200).json(result);

});


module.exports = router;