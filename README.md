# Macol — Smart Temperature Control

A web application for monitoring and controlling temperature devices, with support for ESP32-WROOM-based hardware. Macol provides a centralized interface for checking device status, adjusting temperature settings, managing schedules, and reviewing temperature reports.

## Overview

Macol is the frontend of a temperature-control system that connects users to their registered devices through a backend API.

The interface is built with React and Vite. It communicates with the Macol backend to retrieve device information, update control settings, and display historical temperature data.

The application includes authentication, device management, temperature controls, energy-saving settings, reporting, and account configuration. It also supports localization, including right-to-left layouts for languages such as Persian.

## Features

- **Device dashboard:** View registered devices, their current temperatures, and their operational status.
- **Temperature control:** Adjust target temperatures using interactive controls.
- **Device power control:** Turn supported devices on or off from the dashboard.
- **Multi-device management:** Select multiple devices and apply supported settings.
- **Temperature reports:** Review daily, weekly, and monthly temperature data.
- **Energy-saving mode:** Configure economy-mode temperature and time settings.
- **Device settings:** Access device-specific configuration options.
- **Scheduled downtime:** Configure dates and times when devices should be switched off.
- **Calibration:** Access device calibration functionality.
- **AI-related controls:** Provides an interface for an AI-related device mode, subject to device eligibility and backend support.
- **Account management:** Register, log in, verify accounts, recover passwords, and manage account information.
- **Device management:** View and manage devices associated with the user's account.
- **Push notifications:** Integrates Firebase Cloud Messaging in the browser.
- **Internationalization:** Uses i18next for translated interface content.
- **RTL support:** Adjusts document direction for right-to-left languages.
- **Progressive Web App tooling:** Includes Vite PWA support.

## Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | UI components |
| Vite 6 | Development server and production build |
| React Router 7 | Client-side navigation |
| Redux Toolkit | Application state management |
| React Redux | Connecting components to Redux |
| Axios | Backend API requests |
| Material UI | UI components |
| Bootstrap 5 | Styling and responsive layout |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations |
| Chart.js | Temperature and report visualizations |
| React Multi Date Picker | Date-selection interface |
| Jalali Moment | Jalali calendar utilities |
| i18next and react-i18next | Localization |
| Firebase | Browser-side Firebase integration and messaging |
| React Toastify | Notifications and user feedback |
| Vite PWA plugin | Progressive Web App support |

## Architecture

```text
User
 |
 v
Macol React Frontend
 |
 +-- Authentication
 +-- Device Dashboard
 +-- Temperature Controls
 +-- Device Settings
 +-- Reports and Charts
 |
 v
Axios / HTTP Requests
 |
 v
Macol Backend API
 |
 v
Database and Hardware Integration
 |
 v
ESP32-WROOM / Temperature Sensors
```

The frontend handles the user interface and API requests. Device communication and server-side operations are handled by the backend and the connected hardware integration.

## Project Structure

```text
Macol/
├── public/                 # Static assets and public resources
├── src/
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Application layouts
│   ├── pages/              # Application screens
│   │   ├── authentication/ # Login, registration, verification
│   │   └── settings/       # Account and device settings
│   ├── reducers/           # Redux state slices
│   ├── services/           # API communication
│   ├── localization/       # Translation configuration
│   ├── utils/              # Shared utilities
│   ├── App.jsx             # Routes and application logic
│   └── main.jsx            # Application entry point
├── .env.example
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js compatible with the project dependencies.
- npm.
- A running Macol backend for API-dependent features.

### 1. Clone the repository

```bash
git clone https://github.com/nimash79/Macol.git
cd Macol
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure the backend URL

Create a `.env` file based on `.env.example`:

```dotenv
VITE_API_URL=http://localhost:3000
```

Change the URL to match your backend deployment and port.

**Security note:** Variables prefixed with `VITE_` are exposed to browser-side code. Never place private keys, passwords, or privileged service credentials in frontend environment variables.

### 4. Start the development server

```bash
npm run dev
```

Vite prints the local development URL in the terminal.

### 5. Build for production

```bash
npm run build
```

The production files are generated in the `dist/` directory.

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Build the production application. |
| `npm run lint` | Run ESLint. |
| `npm run preview` | Preview the production build locally. |
| `npm run serve` | Serve the built frontend through the configured PM2 command. |
| `npm run unserve` | Stop and remove the configured PM2 process. |

For production deployment, build the application and serve `dist/` through a static web server or hosting platform. Configure the production API URL before building.

## Integration with ESP32 Hardware

The frontend communicates with the backend rather than directly managing privileged hardware operations.

The overall workflow is:

1. The user signs in and accesses their registered devices.
2. The frontend requests device information from the backend.
3. The user changes a supported device setting.
4. The frontend sends the update to the backend API.
5. The backend processes the request and integrates with the relevant device or hardware service.
6. Updated device information is returned to the frontend.

The actual hardware communication protocol depends on the backend and ESP32 firmware implementation.

## Localization

The application uses i18next and react-i18next for language support. It updates the HTML document's language and direction based on the selected language.

When adding translations, ensure that both the translated content and the layout work correctly in left-to-right and right-to-left modes.

## Deployment

1. Configure `VITE_API_URL` for the target backend.
2. Run `npm run build`.
3. Deploy the generated `dist/` directory.
4. Configure the backend CORS policy to allow the deployed frontend origin.
5. Verify authentication, API requests, and push-notification configuration.

## Related Repository

- [Macol Backend](https://github.com/nimash79/Macol_backend) — API, account management, device operations, reports, and hardware integration.

## License

Refer to the repository's licensing information before redistributing or reusing the code.

## Author

**Nima Sharifinia** · [GitHub](https://github.com/nimash79)
