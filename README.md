# N-Queens Problem Visualizer

This project is a web-based visualizer for the N-Queens problem, built with Next.js and React. It allows users to see different solutions to the N-Queens problem for a given board size (N), and potentially visualize the process of finding those solutions using algorithms like a genetic algorithm (though the core visualization of the problem and its solutions is the primary focus based on the file structure).

## What is the N-Queens Problem?

The N-Queens problem is a classic puzzle in computer science and mathematics. The goal is to place N chess queens on an N×N chessboard such that no two queens threaten each other. This means no two queens can share the same row, column, or diagonal.

## Features (Based on File Analysis)

- **Interactive Chessboard Visualization:** Displays the N×N chessboard with placed queens.
- **Solution Display:** Shows different valid configurations of queens on the board.
- **Controls:** Provides options to likely adjust the board size (N) and potentially trigger the generation or visualization of solutions.
- **Genetic Algorithm Integration (Potential):** The presence of `src/ai/genkit.ts` and `src/ai/dev.ts` suggests the potential for using a genetic algorithm to find solutions, which could be visualized.
- **Shadcn UI Components:** Utilizes a set of pre-built UI components for a clean and modern look.

## Setup

To run this project locally, follow these steps:

1. **Clone the repository:**

