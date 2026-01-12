# Betting Nexa - CAN Semi Finals

A simple and minimalistic betting web app for the CAN (Africa Cup of Nations) semi-finals.

## Features

- User authentication with first name
- View semi-final matches: Egypt vs Senegal, Nigeria vs Morocco
- Betting statistics and predictions
- Detailed betting page with team players and score predictions

## Tech Stack

- React 18
- Vite
- React Router DOM
- MongoDB (backend ready)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at http://localhost:3000

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── data/           # Mock data and constants
├── utils/          # Utility functions
└── styles/         # CSS files
```

## Future Backend Integration

The app is structured to easily integrate with a MongoDB backend:

1. Replace localStorage with API calls in `src/utils/auth.js`
2. Add API service files in `src/services/`
3. Connect to MongoDB for storing user data and bets
