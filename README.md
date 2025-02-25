# Donation System

## Overview
The **Donation System** is a web-based application that allows donors to track their donation history, preferences, and achievements. The system includes:
- Donor profile management
- Tracking of monthly donations
- Visualization of donation trends via charts
- Badge system based on donor contributions

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, Chart.js, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JSON Web Token (JWT)
- **API Requests**: Axios

## Features
### Donor Dashboard
- Displays donor details (name, address, phone number, donation preferences)
- Tracks total donations and last donation date
- Shows badge type based on donation history
- Visualizes donation trends via a line chart (Chart.js)

### Donations Tracking
- Fetches donation data from MongoDB
- Displays number of items donated each month
- Aggregates donation history to show yearly trends

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB

### Setup Instructions
1. **Clone the Repository**
```sh
 git clone https://github.com/your-repo/donation-system.git
 cd donation-system
```

2. **Install Dependencies**
#### Backend
```sh
 cd backend
 npm install
```
#### Frontend
```sh
 cd frontend
 npm install
```

3. **Set Up Environment Variables**
Create a `.env` file in the **backend** folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4. **Start the Server**
```sh
 cd backend
 npm start
```

5. **Start the Frontend**
```sh
 cd frontend
 npm start
```

## API Endpoints
### Donor API
- **GET /api/donor/:id** → Get donor details
- **GET /api/donations/:donorId** → Get donations history

## Usage
- Log in as a donor to view your donation statistics
- Track your monthly donation history
- View your donation badge progress

## Contribution
Feel free to submit a pull request if you'd like to improve the system.

## License
This project is licensed under the MIT License.

