# OnlyConcerts Client

## Overview
The client-side application for OnlyConcerts - a platform that revolutionizes how concert-goers decide to attend live music events. Inspired by how RateMyProfessor impacted academic course selection, this React application provides an intuitive interface for accessing and contributing detailed concert reviews, ratings, and comprehensive tour information.

## Features
- **Concert Discovery**: Browse and filter concerts by artist, genre, location, and date
- **Artist Profiles**: Detailed artist pages with ratings, upcoming tours, and fan reviews
- **User Dashboard**: Personal concert history and wishlist management
- **Concert Comparison**: Side-by-side comparison of different concerts
- **Rating System**: View and contribute to the community rating system
- **Dark/Light Mode**: Toggle between visual themes for comfortable viewing
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint
- `npm run test` - Run tests with Vitest
- `npm run format` - Format code with Prettier

## Technology Stack
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Routing**: React Router 6.20
- **Styling**: TailwindCSS 3.3.5
- **UI Components**: Custom components with Lucide React icons
- **Date Handling**: date-fns 2.30.0
- **Testing**: Vitest


## Key Components

### Page Components
- **HomePage**: Main concert discovery interface with filtering and search
- **ArtistPage**: Detailed artist page with concert listings and ratings
- **UserPage**: User profile displaying concert history and wishlist

### UI Components
- **ArtistBanner**: Displays artist information with interactive rating display
- **ConcertCard**: Card-based concert displays with formatted date and price
- **CompareModule**: Side-by-side concert comparison tool with drag-and-drop
- **RatingModule**: Visual rating distribution with bar charts
- **WishListBubble**: Interactive wishlist items with drag-and-drop support

## API Integration
The client communicates with the backend server through a centralized API service (`apiService.js`). This service handles:

- Authentication with JWT tokens
- Concert and artist data fetching
- User profile and preferences
- Review submission and retrieval

## Contributing
1. Ensure you have the latest dependencies with `npm install`
2. Create a feature branch with `git checkout -b feature/your-feature-name`
3. Follow the existing code style and component patterns
4. Run tests with `npm run test` before submitting changes
5. Submit a pull request with detailed explanation of changes

## Development Notes
- The application uses a modular component architecture
- Authentication tokens are stored in localStorage
- Concert data is fetched from the PostgreSQL database via the backend API

## Connect to Backend
The client expects the backend server to be running on `http://localhost:3000`. Make sure the server is running before starting the client for full functionality.