# FAIREFAC web

Welcome to the **FAIREFAC web** repository, the frontend application for the FAIREFAC system. This project is designed to provide a seamless and user-friendly interface for managing car repair quotes and processes efficiently. Built using modern web technologies, it ensures a responsive and intuitive user experience.

---

## Features

- **Quote Management**: Add, view, and manage repair shop quotes.
- **Secure Authentication**: Robust login and authentication with token management.
- **Dynamic Components**: Leverage modular and reusable components for scalability.
- **Real-Time Updates**: Responsive UI for handling quote actions (acceptance, rejection, etc.) dynamically.
- **API Integration**: Smooth communication with backend services to fetch and update data.
- **Modern UI/UX**: Designed with responsiveness and usability in mind for optimal client interaction.

---

## Tech Stack

- **Frontend Framework**: [React.js](https://reactjs.org) with [Next.js](https://nextjs.org)
- **State Management**: Context API 
- **Styling**: [Tailwind-CSS](https://tailwindcss.com)
- **Utilities**:
  - Dynamic routing with Next.js
  - Responsive design principles

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Yairgg95/FAIREFAC-web.git
   cd FAIREFAC-web
   ```

2. **Install Dependencies**  
   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

3. **Run the Development Server**

   ```bash
   npm run dev
   ```

   Or using yarn:

   ```bash
   yarn dev
   ```

4. **Open in Browser**  
   Navigate to `http://localhost:3000` to access the application.

---

## Folder Structure

```
FAIREFAC-web/
├── components/         # Reusable components
├── pages/              # Next.js page routes
├── styles/             # Styling files
├── next.config.mjs     # Next.js configuration file
├── package-lock.json   # Dependency lock file
├── package.json        # Project configuration and dependencies
├── tailwind.config.js  # Tailwind CSS configuration file
└── README.md           # Documentation
```

---

## Usage

1. Log in using your credentials.
2. View and manage quotes in real-time.
3. Accept or reject quotes with dynamic updates.
4. Review totals and summaries for transparency.

---

## Contribution Guidelines

We welcome contributions to enhance the project! Follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch.
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes.
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to your branch.
   ```bash
   git push origin feature/your-feature
   ```
5. Create a pull request and describe your changes.

