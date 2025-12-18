# Daily Motivator Web Application

A full-stack web application designed to help users build positive habits through 30, 60, and 100-day challenges. The app combines daily motivation with structured tracking for health, fitness, mindfulness, coding, and more.

## Features

*   **User Authentication**: Secure signup and login using JWT and MongoDB.
*   **Challenge Tracking**: 
    *   **Dynamic Challenges**: Backend-managed challenges with dashboard tracking.
    *   **Static Challenges (Offline-First)**: Interactive 30/60/100-day challenge cards that work locally and sync progress to the main dashboard.
    *   **User Isolation**: Static challenge progress is isolated per user, ensuring privacy even on shared devices.
*   **Profile Management**: Update user details, avatar, and notification preferences.
*   **Daily Motivation**: Fresh quotes and content to keep you inspired.
*   **Gamification**: Earn badges and track streaks to stay motivated.
*   **Responsive Design**: Built with Tailwind CSS for a seamless mobile and desktop experience.

## Tech Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS
*   **Backend**: Node.js, Express, MongoDB
*   **Authentication**: JWT (JSON Web Tokens)
*   **Database**: MongoDB (with Mongoose)

## Getting Started

### Prerequisites

*   Node.js (v18+)
*   MongoDB (running locally or a cloud instance like MongoDB Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/daily-motivator.git
    cd daily-motivator
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies** (if separate or shared in root)
    ```bash
    # If backend has its own package.json
    cd backend
    npm install
    cd ..
    # Or if shared in root, you're already set from step 2
    ```

4.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    VITE_API_URL=http://localhost:5000/api
    MONGODB_URI=mongodb://localhost:27017/Daily-Motivator-Web-DataBase
    JWT_SECRET=your_super_secret_key_here
    PORT=5000
    ```

### Running the Application

1.  **Start the Backend Server**
    ```bash
    # From the root directory
    npx ts-node backend/server.ts
    ```
    The server will start on port 5000 (or your configured port). It effectively seeds initial challenges and badges on startup.

2.  **Start the Frontend Development Server**
    ```bash
    # Open a new terminal
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## Usage

1.  **Sign Up**: Create a new account.
2.  **Choose a Challenge**: Browse available challenges (e.g., Coding Skills, Fitness).
3.  **Start Tracking**: 
    *   For **Static Challenges** (cards on home page), click to view the interactive card. Your progress (days completed, streaks) is saved automatically and isolated to your account.
    *   For **Dynamic Challenges**, join via the dashboard and track progress directly.
4.  **View Progress**: Check "My Challenges" to see all your active challenges in one place.


## Deployment

When deploying to Vercel, you must configure your Environment Variables in the Vercel Dashboard.

**CRITICAL: Use a Cloud Database**
Localhost (`mongodb://localhost...`) will **NOT** work on Vercel. You must use a cloud provider like **MongoDB Atlas**.

### Vercel Environment Variables
Set these variables in your Vercel Project Settings > Environment Variables:

| Variable | Value Description |
| :--- | :--- |
| `MONGODB_URI` | Your MongoDB Atlas Connection String (starts with `mongodb+srv://...`). |
| `JWT_SECRET` | A long, random string for security (do not use default). |
| `VITE_API_URL` | **LEAVE EMPTY**. Do NOT set this on Vercel. The app automatically handles it. |

**Note**: Since we deploy both frontend and backend on the same Vercel instance using serverless functions, omitting `VITE_API_URL` ensures the frontend uses the relative `/api` path correctly.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.