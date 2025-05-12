# N-Queens Problem Visualizer
![image](https://github.com/user-attachments/assets/7f9d2a0c-d300-4194-81ab-b156dfb6b572)

https://github.com/user-attachments/assets/85d67004-138f-43c5-9b9d-c4060004dac1

This project is a web-based visualizer for the classic [N-Queens problem](https://en.wikipedia.org/wiki/Eight_queens_puzzle), built using [Next.js](https://nextjs.org/) and [React](https://react.dev/). It allows users to explore and visualize different valid configurations of $N$ queens placed on an $N \times N$ chessboard such that no two queens threaten each other.

## What is the N-Queens Problem?

The N-Queens problem is a well-known combinatorial problem where the objective is to place $N$ non-attacking chess queens on an $N \times N$ chessboard. This constraint means that no two queens can share the same row, column, or diagonal.

## The Backtracking Algorithm for N-Queens

One of the common approaches to solve the N-Queens problem is using a **backtracking algorithm**. This is a recursive approach that explores potential solutions incrementally. Here's a simplified explanation:

1.  **Start with an empty board.**
2.  **Try placing a queen in the first available column of the current row.**
3.  **Check if the placement is valid** (i.e., the new queen doesn't attack any previously placed queens).
4.  **If the placement is valid, move to the next row and repeat step 2.**
5.  **If the placement is invalid, backtrack:** remove the current queen and try placing it in the next available column in the same row.
6.  **If all columns in the current row have been tried without a valid placement, backtrack to the previous row.**
7.  **Continue this process until either a valid configuration with $N$ queens is found, or all possibilities have been exhausted.**

**In this GitHub project, we aim to visualize this backtracking algorithm in action and provide an interactive way to understand how different solutions to the N-Queens problem are discovered.**

## Features

Based on the project files, the visualizer likely includes the following features:

* **Interactive Chessboard Visualization:** Dynamically displays an $N \times N$ chessboard with the placed queens, potentially showing the step-by-step process of the backtracking algorithm.
* **Solution Display:** Presents different valid solutions to the N-Queens problem for the given board size.
* **Board Size Control:** Allows users to adjust the size of the chessboard ($N$) to explore different problem instances.
* **Algorithm Visualization Controls:** Provides options to step through the backtracking algorithm, visualize the placement attempts, and see how invalid placements are rejected.
* **Modern UI:** Implements a clean and modern user interface leveraging [Shadcn UI](https://ui.shadcn.com/).

## Setup

To run this project locally, ensure you have [Node.js](https://nodejs.org/) (version 18.17 or later recommended) and npm (or yarn/pnpm) installed on your system.

### Installation Steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    ```
    Replace `<repository_url>` with the actual URL of this repository.

2.  **Navigate to the project directory:**
    ```bash
    cd <project_folder_name>
    ```
    Replace `<project_folder_name>` with the name of the cloned project folder.

3.  **Install dependencies:**
    Choose your preferred package manager and run the corresponding command:

    * **Using npm:**
        ```bash
        npm install
        ```

    * **Using yarn:**
        ```bash
        yarn install
        ```

    * **Using pnpm:**
        ```bash
        pnpm install
        ```

### Running the Project:

Once the dependencies are installed, start the development server using your package manager:

* **Using npm:**
    ```bash
    npm run dev
    ```

* **Using yarn:**
    ```bash
    yarn dev
    ```

* **Using pnpm:**
    ```bash
    pnpm dev
    ```

After running the command, open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Additional Notes

* **Environment Variables:** If a `.env.example` file exists in the project root, copy it to `.env` and fill in any required environment variables.
* **Building for Production:** To create a production build of the application, use the following command with your package manager:
    * **npm:** `npm run build`
    * **yarn:** `yarn build`
    * **pnpm:** `pnpm build`
    You can then start the production server using `npm start`, `yarn start`, or `pnpm start`.
* **Package Scripts:** Refer to the `scripts` section in the `package.json` file for a complete list of available commands and their functionalities.
