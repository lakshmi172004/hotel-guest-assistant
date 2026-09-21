import { useState } from "react";

function AvailabilityForm() {

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [adults, setAdults] = useState("");

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");


    async function handleAvailability() {

        // Clear previous messages
        setError("");
        setResult(null);


        // Validate form
        if (!checkIn || !checkOut || !adults) {

            setError(
                "Please provide check-in date, check-out date, and number of guests."
            );

            return;
        }


        // Start loading
        setLoading(true);


        try {

            // Call backend availability API
           const response = await fetch(
    `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/availability`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
                    body: JSON.stringify({
                        checkIn: checkIn,
                        checkOut: checkOut,
                        adults: Number(adults)
                    })
                }
            );


            const data = await response.json();


            // Handle backend error
            if (!response.ok) {

                setError(data.message);

                return;
            }


            // Display available rooms
            setResult(data);

        } catch (error) {

            console.error(
                "Availability error:",
                error
            );

            setError(
                "Sorry, we could not check availability right now. Please try again."
            );

        } finally {

            // Stop loading
            setLoading(false);

        }
    }


    return (
        <div className="availability-form">

            <h2>
                Check Room Availability
            </h2>


            {/* Check-in */}

            <div className="form-group">

                <label>
                    Check-in Date
                </label>

                <input
                    type="date"
                    value={checkIn}
                    onChange={(event) =>
                        setCheckIn(event.target.value)
                    }
                />

            </div>


            {/* Check-out */}

            <div className="form-group">

                <label>
                    Check-out Date
                </label>

                <input
                    type="date"
                    value={checkOut}
                    onChange={(event) =>
                        setCheckOut(event.target.value)
                    }
                />

            </div>


            {/* Guests */}

            <div className="form-group">

                <label>
                    Number of Guests
                </label>

                <input
                    type="number"
                    min="1"
                    value={adults}
                    onChange={(event) =>
                        setAdults(event.target.value)
                    }
                    placeholder="Enter guests"
                />

            </div>


            {/* Button */}

            <button
                onClick={handleAvailability}
                disabled={loading}
            >

                {loading
                    ? "Checking..."
                    : "Check Availability"}

            </button>


            {/* Error */}

            {error && (

                <div className="availability-error">

                    {error}

                </div>

            )}


            {/* Results */}

            {result && (

                <div className="availability-result">

                    <h3>
                        Available Rooms
                    </h3>

                    <p>
                        For {result.adults} guest(s)
                    </p>


                    {result.rooms.map(
                        (room, index) => (

                            <div
                                key={index}
                                className="room-card"
                            >

                                <h4>
                                    {room.name}
                                </h4>

                                <p>
                                    Capacity: {room.capacity} guests
                                </p>

                                <p>
                                    ₹{room.pricePerNight} per night
                                </p>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default AvailabilityForm;