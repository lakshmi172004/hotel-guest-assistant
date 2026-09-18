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