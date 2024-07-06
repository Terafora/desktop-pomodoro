# Pomodoro Timer and Checklist Application
## Overview

The Pomodoro Timer and Checklist Application is a desktop productivity tool built using Electron, HTML, CSS, and JavaScript. It combines a Pomodoro timer for time management with a checklist feature for task organization.

## Features

- **Pomodoro Timer**: Helps users manage their work time using the Pomodoro Technique, with customizable intervals.
- **Checklist**: Allows users to create, edit, and delete tasks on a checklist.
- **Persistent Storage**: Checklist items are stored locally using localStorage for data persistence.

## Usage

1. **Pomodoro Timer**
- Click "Start" to begin the timer.
- Use "Reset" to reset the timer to the default 25 minutes.

2. **Checklist**
- Enter a task in the input field and click "Add Task" to add it to the checklist.
- Click on a task to mark it as completed (or incomplete).
- Click "Edit" to modify a task's text.
- Click "Delete" to remove a task from the checklist.

## Design

The application features a minimalist design with a focus on usability:

- **User Interface**: Simple and intuitive interface for easy task management.
- **Modal Windows**: Modal dialogs for editing tasks to ensure focus on task management without clutter.

## Known Issues

- **Draggable Window**: Currently, the application window is not draggable. I am actively working on implementing this feature to improve usability.
- **Styling Issues**: Some CSS styling adjustments may be needed for better appearance and functionality across different platforms and screen sizes.

## Installation

To run the application locally:

1. Clone this repository.
2. Install dependencies with npm install.
3. Start the application with npm start.

## Contributing

Contributions are welcome! If you encounter any bugs or have suggestions for improvement, please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
