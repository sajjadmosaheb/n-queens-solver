# N-Queens Problem Visualizer

This project is a web-based visualizer for the N-Queens problem, built with Next.js and React. It allows users to explore different solutions to the N-Queens problem for a given board size (N). The primary focus is on visualizing valid configurations of queens on the chessboard.

## What is the N-Queens Problem?

The N-Queens problem is a classic puzzle in computer science and mathematics. The goal is to place N chess queens on an N×N chessboard such that no two queens threaten each other. This means no two queens can share the same row, column, or diagonal.

## Features (Based on File Analysis)

- **Interactive Chessboard Visualization:** Displays the N×N chessboard with placed queens.
- **Solution Display:** Shows different valid configurations of queens on the board.
- **Controls:** Provides options to likely adjust the board size (N) and potentially trigger the generation or visualization of solutions.
- **Shadcn UI Components:** Utilizes a set of pre-built UI components for a clean and modern look.

## Setup

To run this project locally, follow these steps:

This project appears to be a web application likely built with Next.js, judging by the presence of next.config.ts, package.json, and files within the src/app directory. It seems to include components for visualizing the N-Queens problem (files in src/components/queens-gambit), as well as a variety of UI components (files in src/components/ui). There are also hooks, utility functions, and AI-related files (src/ai).

Based on the file structure and common practices for Next.js projects, here's how you would typically install and run this project locally:

Prerequisites:

    Node.js and npm (or yarn/pnpm): You need to have Node.js installed on your system. You can download it from the official Node.js website (https://nodejs.org/). npm is usually included with Node.js, but you might prefer using yarn or pnpm as a package manager.

Installation Steps:

    Clone the repository: If the project is in a Git repository, clone it to your local machine using the following command in your terminal:

git clone <repository_url>

Replace `<repository_url>` with the actual URL of the repository.

2. Navigate to the project directory: Change your current directory to the project's root folder:

cd <project_folder_name>

Replace `<project_folder_name>` with the name of the cloned project folder.

3. Install dependencies: Use your preferred package manager to install the project's dependencies.

Using npm:

npm install

Using yarn:

yarn install

Using pnpm:

pnpm install

Running the Project:

    Start the development server: Once the dependencies are installed, you can start the development server.

    Using npm:

npm run dev

Using yarn:

yarn dev

Using pnpm:

pnpm dev

    Access the application: The development server will typically start on http://localhost:3000. Open your web browser and navigate to this address to see the application running.

Additional Notes:

    Environment Variables: Some projects require environment variables for configuration (e.g., API keys). Check if there's a .env.example file in the project root. If so, create a .env file by copying the example and filling in the necessary values.
    Build for Production: To build the project for production, you would typically use a command like npm run build, yarn build, or pnpm build. After building, you can start the production server with npm start, yarn start, or pnpm start.
    Specific Instructions: The package.json file contains scripts that define how to build, run, and perform other tasks in the project. Always check the scripts section of package.json for any project-specific instructions.
