# Macol — Backend API

The backend service for **Macol**, a temperature-control application that manages users, connected devices, device settings, and temperature reports.

The backend is built with Node.js and Express. It uses MongoDB through Mongoose and integrates Firebase Admin SDK functionality for server-side Firebase operations.

## Overview

Macol Backend provides the API layer between the web application and the device-management system.

It handles account and user operations, device configuration, hardware-related requests, and report retrieval. The backend also includes authentication middleware, logging, and date-related utilities.

**Live backend:** https://macol-backend.vercel.app

## Features

- **REST API:** Provides HTTP endpoints for the frontend.
- **User management:** User-related routes and middleware.
- **Account operations:** Account-related endpoints.
- **Device management:** Retrieve and update device information and settings.
- **Hardware integration:** Dedicated routes and middleware for hardware-related operations.
- **Temperature reporting:** Report-related endpoints.
- **Authentication:** JWT-related utilities and password hashing support.
- **Firebase integration:** Uses Firebase Admin SDK.
- **Logging:** Centralized logging with Winston.
- **Date utilities:** Includes date-fns and Jalali calendar utilities.
- **Spreadsheet generation:** ExcelJS is available for report-related functionality.
- **Database persistence:** Uses Mongoose to connect to MongoDB.

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express 5 | HTTP API framework |
| MongoDB | Document database |
| Mongoose | MongoDB object modeling |
| Firebase Admin SDK | Server-side Firebase integration |
| JSON Web Token | Authentication token support |
| bcryptjs | Password hashing |
| Axios | HTTP requests |
| dotenv | Environment configuration |
| Winston | Application logging |
| ExcelJS | Spreadsheet generation |
| date-fns | Date manipulation |
| moment-jalaali | Jalali calendar utilities |

## API Architecture

```text
Macol Frontend
      |
      | HTTP Requests
      v
Express Backend
      |
      +-- API Middleware
      |
      +-- Authentication Middleware
      |
      +-- Accounts
      |
      +-- Users
      |
      +-- Devices
      |
      +-- Hardware
      |
      +-- Reports
      |
      v
MongoDB / Mongoose
      |
      v
Hardware Integration
      |
      v
ESP32-WROOM and Temperature Sensors
```

The backend exposes separate route groups for different application responsibilities. Hardware communication details depend on the corresponding implementation and device firmware.

## Repository Structure

```text
Macol_backend/
├── src/
│   ├── routes/             # API route definitions
│   ├── middlewares/        # API and authentication middleware
│   ├── utils/              # Shared utilities and constants
│   ├── firebase/           # Firebase integration
│   ├── app.js               # Express entry point
│   └── logger.js            # Logging configuration
├── .env.example             # Environment variable template
├── .gitignore
├── package.json
├── package-lock.json
└── LICENSE
```

The route modules are organized into users, accounts, devices, hardware, and reports.

## Getting Started

### Prerequisites

- Node.js compatible with the project dependencies.
- npm.
- A running MongoDB instance or MongoDB connection string.
- Firebase configuration and permissions if the relevant Firebase features are required.

### 1. Clone the repository

```bash
git clone https://github.com/nimash79/Macol_backend.git
cd Macol_backend
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment variables

Create a local `.env` file based on `.env.example`.

The repository defines these variables:

```dotenv
MONGO=mongodb://127.0.0.1:27017/macol
PORT=3000
JWTKEY=replace_with_a_secure_random_secret
MESSAGE_APIKEY=replace_with_your_message_service_key
```

These values are examples for local development, not production credentials. Update the MongoDB connection string and other settings according to your deployment. The example database name is illustrative.

The application requires `MONGO` and `PORT` during startup. Authentication and messaging features may also depend on `JWTKEY`, `MESSAGE_APIKEY`, and the relevant Firebase configuration.

Never commit real credentials or production secrets.

### 4. Start the development server

```bash
npm run dev
```

This starts the application using Nodemon.

For standard execution:

```bash
npm start
```

The backend starts from `src/app.js` and connects to MongoDB using the configured `MONGO` connection string.

### 5. Configure the frontend

Set the frontend's `VITE_API_URL` to the backend's base URL.

For local development:

```dotenv
VITE_API_URL=http://localhost:3000
```

Ensure that the backend is reachable from the browser and that its CORS policy allows the frontend origin.

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the backend with Node.js. |
| `npm run dev` | Start the backend using Nodemon. |
| `npm run serve` | Start the configured PM2 process. |
| `npm run unserve` | Stop and remove the configured PM2 process. |

## API Route Groups

The application registers these route groups:

| Base path | Purpose |
|---|---|
| `/api/accounts` | Account-related operations |
| `/api/users` | User-related operations |
| `/api/devices` | Device management and settings |
| `/api/hardware` | Hardware-related operations |
| `/api/reports` | Temperature and device reports |

Some routes are protected by middleware. Consult the route definitions and middleware implementation for the exact endpoint paths, required tokens, request payloads, and response formats.

## Hardware Integration

The backend is responsible for processing requests from the frontend and coordinating hardware-related operations.

A typical flow is:

1. A user selects a device or changes its settings in the frontend.
2. The frontend submits an API request.
3. The backend validates and processes the request.
4. Device-related data is persisted or updated.
5. The backend performs the configured hardware integration.
6. Updated device information and reports are returned to the frontend.

The exact protocol used to communicate with ESP32-WROOM hardware should be documented alongside the relevant hardware code and firmware.

## Deployment

The repository includes PM2 scripts for process management:

```bash
npm run serve
```

To stop the configured process:

```bash
npm run unserve
```

For production deployment:

- Configure a secure MongoDB connection.
- Set strong authentication secrets.
- Configure Firebase credentials securely.
- Restrict CORS to trusted frontend origins.
- Use HTTPS for public API traffic.
- Validate and authorize device-control requests.
- Protect hardware endpoints against unauthorized access.
- Configure logging, backups, and monitoring.
- Keep environment files and credentials out of source control.

## Security Considerations

Temperature-control APIs can affect physical devices. Authentication alone is not sufficient; authorization should verify that a user is allowed to control each requested device.

Review the API middleware and route-level access checks before deployment. The backend currently configures permissive CORS headers in its application entry point, so production deployments should restrict allowed origins and review credential handling.

Store privileged Firebase credentials on the server only. Never expose Firebase Admin SDK credentials to the browser or commit them to Git.

## Related Repository

- [Macol Frontend](https://github.com/nimash79/Macol) — React-based temperature-control interface.

## License

The repository includes an MIT license. Refer to the [`LICENSE`](LICENSE) file for the complete terms.

## Author

**Nima Sharifinia** · [GitHub](https://github.com/nimash79)
