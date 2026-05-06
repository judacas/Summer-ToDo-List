# Summer Bucket List App

A collaborative full-stack web application that allows users to create, manage, and visualize their summer bucket list activities. The app is built using Flask, MongoDB, Docker, Jenkins CI/CD, and Google Maps API to demonstrate a complete cloud-native DevOps workflow.

---

# Features

- Add bucket list activities
- Mark activities as completed
- Delete activities
- Categorize items (Travel, Fun, Personal, etc.)
- Track progress with completion status
- Store data persistently using MongoDB
- Visualize locations using Google Maps
- Fully containerized using Docker
- Automated CI/CD pipeline using Jenkins

---

# Tech Stack

| Category | Tools & Technologies Used |
|------|------------------|
| Backend | Python, Flask, PyMongo |
| Frontend | HTML, CSS, JavaScript |
| Database | MongoDB |
| DevOps / Tools | Docker, Docker Compose, Jenkins, GitHub |
| APIs | Google Maps JavaScript API |

---

# Repository Structure

---

## Team Responsibilities

This project follows a CI/CD workflow where code moves from setup → infrastructure → backend → frontend → testing → final validation.

---

## 1. Devanshi — CI/CD Pipeline & Orchestration
**Pipeline Setup First Step**
- Set up and configured Jenkins server
- Connected Jenkins with GitHub repository
- Defined full pipeline structure (Checkout → Build → Verify → Deploy)
- Configured automatic triggers on push to main branch
- Set up Google Maps API key in Google Cloud Console with restrictions
- Debugged pipeline failures and ensured stability

### Jenkins Contribution:
- Owned entire Jenkins pipeline architecture
- Configured GitHub → Jenkins integration
- Set up automated CI/CD trigger system

---

## 2. Aarav — Docker & Containerization
**Containerization Layer**
- Created Dockerfile for Flask application
- Built Docker Compose file for Flask + MongoDB services
- Configured MongoDB volume persistence
- Passed environment variables (including Google Maps API key)

### Jenkins Contribution:
- Owned the Build stage in Jenkins pipeline
- Implemented `docker build` and `docker-compose up` inside Jenkinsfile
- Ensured containers are built and launched correctly during pipeline execution

---

## 3. Jasmine — MongoDB Configuration, Security & Infrastructure Setup
**Database + Security Layer**
- Configured MongoDB container with environment variables
- Defined MongoDB credentials (username, password, database name)
- Seeded database with initial bucket list data (with coordinates)
- Created architecture diagram for system design
- Ensured secure handling of Google Maps API key usage

### Jenkins Contribution:
- Stored MongoDB credentials in Jenkins Credentials Manager
- Stored Google Maps API key securely in Jenkins
- Documented Jenkins credential setup process in final report

---

## 4. Daniel — Flask Backend Development
**Backend Development**
- Built all Flask API routes (add, delete, update items)
- Connected Flask to MongoDB using PyMongo
- Designed data model (name, category, due date, status, coordinates)
- Implemented `/health` endpoint for Jenkins monitoring
- Ensured API endpoints return correct responses for frontend

### Jenkins Contribution:
- Added Jenkins stage to install Python dependencies
- Ensured Flask application starts successfully during pipeline verification

---

## 5. Lavanya — Frontend/UI
**User Interface Development**
- Designed and styled frontend using HTML/CSS
- Created summer-themed UI design
- Built progress tracking (completion counter)
- Added category labels for bucket list items

### Jenkins Contribution:
- Configured Jenkins to archive build artifacts/screenshots after successful deployment
- Maintained visual proof of successful pipeline runs

---

## 6. Maia — Testing & Verification
**Quality Assurance**
- Wrote test scripts for Flask API routes
- Verified MongoDB connectivity
- Checked Google Maps API key availability in environment
- Validated API responses during pipeline execution

### Jenkins Contribution:
- Owned Verify stage in Jenkins pipeline
- Integrated automated test suite into Jenkins
- Ensured pipeline fails if any test does not pass

---

# Setup Instructions
