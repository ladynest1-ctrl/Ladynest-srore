# LedyNest

LedyNest is a modern web application built using the **Next.js** framework. It features interactive UI sliders powered by **Swiper** and smooth custom animations, integrated with **MySQL (via Aiven Cloud)** for data storage, **NextAuth.js** for authentication, and **Cloudinary** for media management.

## Prerequisites

Before setting up the project locally, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (Recommended version: 18.x or 20.x LTS)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

Follow these steps to get a local copy of the project up and running.

### 1. Clone the Repository
\\\ash
git clone https://github.com/Abdul-Hanan05/LedyNest.git
cd LedyNest
\\\

### 2. Install Project Dependencies
You must install the required node modules (including Next.js, Swiper, animation libraries, and other packages) before running the project:
\\\ash
npm install
# or if you use yarn
yarn install
\\\

### 3. Setup Environment Variables
You need to configure the environment variables to connect the application with the backend services.

1. Create a new file named \.env.local\ in the root directory of the project.
2. Copy the structure from \.env.example\ into your \.env.local\ file.
3. Replace the placeholder values with your actual configuration keys (Database URL, Cloudinary credentials, NextAuth secret, and SMTP Email settings).

### 4. Run the Development Server
Start the local server to view the application:
\\\ash
npm run dev
# or
yarn dev
\\\

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application running live with all components, Swiper sliders, and animations active.

## Project Features & Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** MySQL (Hosted on Aiven Cloud)
- **Authentication:** NextAuth.js
- **Media Storage:** Cloudinary
- **UI Components:** Integrated with **Swiper** for sliders and custom animations.

## Project Scripts

In the project directory, you can run the following commands:

- \
pm run dev\: Runs the app in development mode.
- \
pm run build\: Builds the production application for deployment.
- \
pm run start\: Starts the Next.js production server after building.
- \
pm run lint\: Runs Next.js built-in ESLint to catch code issues.

## Deployment on Vercel

This project is optimized to be deployed on the **Vercel** platform:

1. Push your latest code changes to the GitHub repository.
2. Log into your [Vercel Dashboard](https://vercel.com/) and click on **New Project**.
3. Import this repository (\LedyNest\).
4. In the **Environment Variables** section during configuration on Vercel, copy and paste all keys from your \.env.local\ file.
   * *Note: Make sure to update \NEXTAUTH_URL\ on Vercel to your live domain url instead of localhost.*
5. Click **Deploy**. Vercel will automatically handle the build and deployment process.
