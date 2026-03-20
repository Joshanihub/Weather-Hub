# WeatherHub - Premium Weather Dashboard

A visually striking weather application built with React, TypeScript, and Tailwind CSS. WeatherHub provides real-time weather data, forecasts, and interactive maps with a modern, atmospheric design.

## Features

### Core Functionality
- **Current Weather**: Real-time weather data with temperature, humidity, wind speed, and conditions
- **5-Day Forecast**: Extended weather predictions with detailed daily breakdowns
- **Interactive Map**: Weather visualization with multiple layers (temperature, precipitation, wind, clouds)
- **Location Search**: Search for weather information by city name worldwide
- **Saved Locations**: Save and manage favorite weather locations
- **Weather Alerts**: Severe weather notifications and warnings
- **Unit Preferences**: Customize temperature, wind, pressure, and visibility units

### Design Features
- **Atmospheric UI**: Weather-aware visuals that adapt to current conditions
- **Premium Components**: Elegant cards, smooth transitions, and refined typography
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Themes**: Multiple theme options with smooth transitions
- **Micro-interactions**: Subtle animations and hover effects throughout

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Maps**: Leaflet (integrated for weather layers)
- **API**: OpenWeather API
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your OpenWeather API key to `.env`:
```
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

### API Setup

1. Get a free API key from [OpenWeather](https://openweathermap.org/api)
2. Add the key to your `.env` file
3. The app will automatically use real weather data

## Project Structure

```
weather-hub/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── layout/          # Layout components
│   │   └── weather/         # Weather-specific components
│   ├── pages/               # Page components
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── styles/              # Global styles
├── public/                  # Static assets
└── docs/                    # Documentation
```

## Design System

### Colors
- **Primary**: Blue gradient system for main actions and accents
- **Weather**: Thematic colors for different weather conditions
- **Surface**: Neutral palette for cards and backgrounds

### Typography
- **Font**: Inter with optimized font-feature-settings
- **Scale**: Responsive typography from xs to 6xl
- **Hierarchy**: Clear distinction between headings, body, and labels

### Components
- **Cards**: Multiple variants (default, glass, weather, elevated)
- **Buttons**: Primary, secondary, ghost, and danger variants
- **Forms**: Consistent input fields with validation states
- **Navigation**: Responsive header with mobile menu

## Pages

1. **Home**: Current weather dashboard with quick stats
2. **Search**: Location search with results and history
3. **Forecast**: 5-day forecast with hourly details
4. **Map**: Interactive weather map with layers
5. **Saved**: Manage saved locations
6. **Settings**: User preferences and customization

## Features in Detail

### Weather Data
- Real-time temperature, feels-like temperature
- Humidity, pressure, visibility, UV index
- Wind speed and direction
- Weather conditions with descriptive icons
- Sunrise/sunset times

### Forecast System
- 5-day weather forecast
- Hourly breakdown for selected days
- Precipitation probability
- Temperature ranges
- Weather condition predictions

### Interactive Map
- Multiple weather layers
- Zoom and pan controls
- Location search integration
- Weather overlay visualization

### User Experience
- Smooth page transitions
- Loading states and skeleton screens
- Error handling with friendly messages
- Responsive design for all devices
- Accessibility features (ARIA labels, keyboard navigation)

## Build and Deploy

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Environment Variables

- `VITE_OPENWEATHER_API_KEY`: Your OpenWeather API key
- `VITE_DEFAULT_LOCATION`: Default location for initial load

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- OpenWeather for providing weather data API
- Vite for the fast development experience
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icon set
