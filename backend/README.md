# Hotel Guest Assistant

AI-powered hotel guest assistant built as a full-stack application.

The application allows hotel guests to:

- Ask questions about hotel facilities and policies
- Ask about check-in and check-out times
- Ask about breakfast and Wi-Fi
- View available room types
- Check room availability
- Continue availability requests across multiple messages
- Receive safe fallback responses when information is unavailable

---

## 1. Project Overview

This project was developed as part of a Software Engineer assignment.

The application demonstrates a hotel website assistant that combines:

- React frontend
- Node.js and Express backend
- Hotel knowledge base stored in JSON
- Deterministic availability logic
- AI-assisted natural language responses
- Conversation context
- Automated backend tests

The hotel information used in this project is mock data created specifically for the assignment.

---

## 2. Architecture

The application follows a frontend-backend architecture.

```text
Guest
  |
  v
React Frontend
  |
  | HTTP API requests
  v
Node.js + Express Backend
  |
  +----------------------+
  |                      |
  v                      v
Hotel Knowledge Base   Availability Service
(JSON)                  |
  |                     |
  v                     v
AI Service           Room Matching
  |
  v
Safe Response