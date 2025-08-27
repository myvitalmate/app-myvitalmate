# MyVitalMate

![Status](https://img.shields.io/badge/status-in--progress-yellow)
![Goal](https://img.shields.io/badge/goal-learning--project-blue)

![Backend](https://img.shields.io/badge/backend-Spring%20Boot-orange)
![Database](https://img.shields.io/badge/database-PostgreSQL-lightgrey)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-green)

MyVitalMate is a web application created for learning purposes.  
It allows you to:

- Chat with a simple chatbot
- Search for recipes
- Track your diet intake with a **Nutrient Log** that automatically calculates macro- and micronutrients and calories

All data is stored in your personal account using **JWT authentication**.

👉 **Live Application:** [https://app-myvitalmate.pages.dev/](https://app-myvitalmate.pages.dev/)

⚠️ **Note:** The backend may take up to **60 seconds** to respond on first request due to cold starts.

---

## 📑 Table of Contents

- [Learning Goals](#-learning-goals)
- [Features](#-features)
- [In progress](#-in-progress)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Additional Tools](#-additional-tools)
- [API Services](#-api-services)
- [Deployment](#-deployment)

---

## 📚 Learning Goals

- Applying best practices
- Spring Boot fundamentals
- React with Shadcn/UI fundamentals
- Debugging with IntelliJ IDEA
- CRUD operations
- Relational databases with primary & foreign keys
- REST APIs
- Authentication & JWT

---

## 🚀 Features

- **User Authentication:** Registration and login with role separation (Patient and Dietitian).
- **Chatbot:** Powered by a GPT model and a local llama model (Tab: *Chat*).
- **Recipe Search:** Fetch recipes via API, including ingredients and step-by-step instructions (Tab: *Recipes*).
- **Patient Management:** Simple overview of patient profiles, available only to dietitians as a first step towards
  managing patients (Tab: *Profile*).
- **Nutrition Log:** Track your food intake per user (only as a Patient). Dietitians can also view the logs of their
  patients (Tab:
  *Diet Protocol*).

---

## 🧩 In progress

- Unit-, Integration and End-to-End tests
- Add searched recipes to Nutrition Log via button
- Add additional filter options for the search (e.g., allergies)
- Personalize and advance chatbot knowledge, including the ability to remember conversations (RAG)
- Refactor frontend
- Add social media functionalities such as viewable profiles, messaging, and reviews

---

## 🏗 Architecture

- Monolithic application

---

## 🛠 Tech Stack

- **Backend:** Java, Spring Boot
- **Database:** PostgreSQL
- **Frontend:** TypeScript, React, Shadcn/UI

---

## 🔧 Additional Tools

- GitHub
- Jira

---

## 🌐 API Services

- [Spoonacular](https://spoonacular.com/food-api)
- [OpenAI](https://openai.com/)

---

## 🚢 Deployment

- **Backend:** Render
- **Database:** Neon Postgres
- **Frontend:** Cloudflare Pages

---
