# Hotel Guest Assistant

A full-stack AI-powered hotel guest assistant built as part of the Simplotel Software Engineer assignment.

The application allows hotel guests to ask questions about hotel facilities, policies, rooms, check-in/check-out, breakfast, Wi-Fi, and room availability through a conversational chat interface.

---

## 1. Project Overview

The goal of this project is to provide a simple conversational assistant for hotel guests.

A guest can:

- Ask questions about the hotel
- Ask about check-in and check-out times
- Ask about breakfast and hotel amenities
- Ask about rooms and room capacity
- Request a room for a specific number of guests
- Provide check-in and check-out dates through conversation
- Check suitable room availability
- Continue follow-up questions in the same conversation
- Receive a safe fallback when the system does not have reliable information

The frontend communicates with the backend API. The backend manages hotel information, conversation context, availability logic, and AI responses.

---

## 2. Technology Stack

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- JavaScript
- REST APIs

### Data

- JSON-based hotel knowledge base

### AI

- OpenAI API integration
- Safe fallback when an AI API key is unavailable or the AI service fails

### Testing

- Jest
- Supertest

### Version Control

- Git
- GitHub

---

## 3. Architecture

```text
Guest
  |
  v
React Frontend
  |
  | HTTP Request
  v
Express Backend
  |
  +--------------------+
  |                    |
  v                    v
Hotel Knowledge Base   Availability Service
  |                    |
  |                    |
  +----------+---------+
             |
             v
        AI Service
             |
             v
       Structured Response
             |
             v
        React Frontend

        Yes. Since you already have **Sections 1–3**, paste the following **at the very bottom of your existing `README.md` in VS Code**.

**Do not delete Sections 1–3.**
Paste everything from **`## 4. Project Structure`** through **`## 21. Conclusion`**.

````markdown
## 4. Project Structure

```text
hotel-guest-assistant/
│
├── backend/
│   ├── data/
│   │   └── hotel.json
│   ├── src/
│   │   ├── routes/
│   │   │   ├── chatRoutes.js
│   │   │   └── availabilityRoutes.js
│   │   ├── services/
│   │   │   ├── hotelService.js
│   │   │   ├── availabilityService.js
│   │   │   ├── aiService.js
│   │   │   └── conversationService.js
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   │   ├── availability.test.js
│   │   └── chat.test.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── AvailabilityForm.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
````

## 5. Hotel Knowledge Base

The application uses a small JSON-based hotel knowledge base.

It contains:

* Hotel name
* Check-in and check-out times
* Breakfast information
* Hotel amenities
* Cancellation policy
* Room types
* Room capacity
* Room prices
* Frequently asked questions

The hotel information is mock data created specifically for this assignment.

## 6. AI vs Deterministic Logic

The application separates AI responsibilities from business-critical logic.

### AI is used for:

* Understanding natural-language guest questions
* Generating conversational responses
* Handling appropriate hotel-related questions

### Deterministic backend logic is used for:

* Validating guest information
* Processing dates
* Validating guest count
* Checking required availability information
* Selecting suitable rooms based on capacity
* Returning availability results
* Handling errors and fallbacks

The AI is not allowed to guess room availability.

This separation reduces hallucination risk and keeps business-critical decisions predictable.

## 7. Conversation Context

The backend maintains basic conversation context using a conversation ID.

Example:

```text
Guest:
I need a room for 3 guests

Assistant:
Please provide your check-in and check-out dates.

Guest:
September 20

Guest:
September 22

Guest:
Check availability
```

The backend remembers the previously provided guest count and dates during the conversation.

## 8. Availability Logic

The availability service accepts:

```text
checkIn
checkOut
adults
```

It validates:

1. Check-in date is provided.
2. Check-out date is provided.
3. Check-out is after check-in.
4. Guest count is valid.
5. A suitable room capacity exists.

For example, a request for 3 guests can return:

```text
Deluxe Room
Family Suite
```

For this assignment, availability is represented by suitable room types based on room capacity. It is not connected to a real hotel inventory system.

A production system would connect to a live hotel inventory or booking system.

## 9. API Endpoints

### Get Hotel Information

```http
GET /api/hotel
```

Example:

```bash
curl http://localhost:5000/api/hotel
```

### Chat API

```http
POST /api/chat
```

Example request:

```json
{
  "message": "What time is check-in?"
}
```

### Availability API

```http
POST /api/availability
```

Example request:

```json
{
  "checkIn": "2026-09-20",
  "checkOut": "2026-09-22",
  "adults": 3
}
```

## 10. Running the Application

### Backend

Open a terminal:

```bash
cd backend
npm install
npm start
```

Backend runs at:

```text
http://localhost:5000
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

Open the frontend URL in a browser.

## 11. Environment Variables

The backend can use an environment file:

```text
backend/.env
```

Example:

```env
OPENAI_API_KEY=your_api_key_here
```

The API key is kept on the backend and is not exposed to the frontend.

The `.env` file is excluded using `.gitignore`.

## 12. Error Handling and AI Failure

The application provides safe fallback behavior when reliable information is unavailable.

For example, if a guest asks:

```text
What is the nearest space station?
```

the assistant does not invent an answer.

Instead, it responds with a safe message explaining that it does not have reliable information and guides the guest toward supported hotel questions.

If the AI service is unavailable or no valid API key is configured, the backend uses fallback behavior instead of failing the entire application.

## 13. Testing

Automated tests are implemented using Jest and Supertest.

Run:

```bash
cd backend
npm test
```

The tests cover:

* Valid availability request
* Missing check-in date
* Invalid date order
* Invalid guest count
* Guest count exceeding room capacity
* Check-in question
* Check-out question
* Breakfast question
* Swimming pool question
* Empty message
* Unsupported question fallback
* Missing availability information
* Conversation context
* Room capacity handling
* Conversation ID

## 14. Evaluation Scenarios

The application was evaluated using the following scenarios:

### Scenario 1 — Check-in

```text
What time is check-in?
```

The assistant provides the hotel check-in time.

### Scenario 2 — Breakfast

```text
Is breakfast included?
```

The assistant provides breakfast information and timing.

### Scenario 3 — Swimming Pool

```text
Does the hotel have a swimming pool?
```

The assistant answers using the hotel knowledge base.

### Scenario 4 — Room for 3 Guests

```text
I need a room for 3 guests
```

The assistant requests the missing dates.

### Scenario 5 — Conversational Dates

```text
September 20
September 22
```

The backend stores the dates as conversation context.

### Scenario 6 — Availability

```text
Check availability
```

The backend performs deterministic availability checking.

### Scenario 7 — Missing Information

```text
Check availability
```

without dates or guest count.

The assistant requests the missing information rather than guessing.

### Scenario 8 — Unsupported Question

```text
What is the nearest space station?
```

The assistant provides a safe fallback instead of inventing information.

### Scenario 9 — Frontend and Backend Integration

A guest sends a question through the React interface.

The request follows:

```text
Frontend
   ↓
Backend API
   ↓
Hotel / AI service
   ↓
Backend response
   ↓
Frontend
```

### Scenario 10 — AI Dependency Failure

If the AI service is unavailable or no valid API key is configured, the application provides fallback behavior.

## 15. Product and UX Decisions

The main customer problem is that hotel guests need quick answers about hotel facilities, policies, rooms, and availability.

A conversational interface allows guests to ask questions naturally without searching through multiple pages.

Important UX decisions include:

* Clear chat interface
* User and assistant messages
* Loading state
* Error and fallback messages
* Conversational follow-ups
* Availability results
* Responsive interface

## 16. Hallucination Prevention

The application reduces hallucination risk by separating AI responses from business logic.

Hotel facts come from the hotel knowledge base.

Availability comes from deterministic backend logic.

The AI is not trusted to decide whether a room is available.

If reliable information cannot be found, the application provides a safe fallback instead of inventing an answer.

## 17. Production Improvements

If this application were developed further for production, improvements could include:

* Real hotel inventory integration
* Production database
* Persistent conversation storage
* Authentication and authorization
* Rate limiting
* Structured logging and monitoring
* Better date and timezone handling
* More comprehensive E2E testing
* Production secret management
* AI evaluation and monitoring
* Multilingual guest support
* Cloud deployment

## 18. Measuring Usefulness

Possible product metrics include:

* Percentage of questions successfully answered
* Availability request completion rate
* Conversation abandonment rate
* Average response time
* Fallback rate
* Guest satisfaction
* Percentage of conversations resolved without human support

## 19. AI Tools Used

AI assistance was used during development for:

* Understanding assignment requirements
* Project architecture planning
* Code generation and review
* Debugging
* Test scenario design
* Documentation

Important technical decisions were reviewed and understood before implementation.

## 20. Engineering Decisions

### Why React?

React provides a component-based approach for creating the interactive chat interface.

### Why Express?

Express provides a simple way to build REST APIs and organize backend routes and services.

### Why JSON?

A JSON knowledge base is simple and sufficient for the small hotel dataset required for this assignment.

### Why separate availability from AI?

Room availability is business-critical. Deterministic logic provides predictable results and prevents AI hallucinations.

### Why keep the API key on the backend?

API keys are sensitive credentials and should not be exposed to browser clients.

## 21. Conclusion

This project demonstrates a full-stack AI-powered hotel guest assistant with:

* React frontend
* Node.js and Express backend
* Hotel knowledge base
* Conversational context
* Deterministic availability logic
* AI integration
* Safe fallback handling
* Automated testing
* Git and GitHub version control

The implementation focuses on a practical guest journey while keeping business-critical decisions reliable and deterministic.

```

### After pasting

1. Press **Ctrl + S**.
2. Scroll through the README and make sure you can see sections **4 through 21**.
3. **Do not edit anything else yet.**

Then tell me **"saved"** and I'll give you the exact Git commands to update GitHub.
```
