# Smart Campus System (SCAMS)  Backend
## Overview

This backend service powers the Smart Campus System (SCAMS) using modern technologies to provide robust API endpoints for campus management. The system is built with Node.js and Express, utilizing Prisma ORM for database operations.

## Technology Stack

- **Node.js & Express**: Server framework
- **TypeScript**: Type-safe coding
- **Prisma ORM**: Database operations 
- **MySQL**: Database system
- **JWT**: Authentication
- **Docker**: Containerization support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file with the following variables:
   ```
   PORT=4000
   SERVER_URL=http://localhost:4000
   JWT_SECRET=your_jwt_secret_key
   DATABASE_URL=mysql://username:password@localhost:3306/database_name
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

### Running the Application

```bash
# Development mode
npm run start

# Build for production
npm run build

# Clear build directory
npm run clear
```

## Project Structure

```
backend/
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma
├── src/
│   ├── configs.ts        # Configuration variables
│   ├── index.ts          # Application entry point
│   ├── routes/           # API routes
│   └── types/            # TypeScript type definitions
├── .env                  # Environment variables
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## Database

The project uses Prisma ORM with MySQL. The schema is defined in schema.prisma.

## Authentication

Authentication is handled using JWT (JSON Web Tokens). The token payload includes user ID, email, and role information as defined in the JwtPayload interface.

## API Routes

All API routes are organized in the routes directory and consolidated in index.routes.ts.

## Documentation

API documentation is available in the `API.md` file.

## Contributing

Please follow the established code structure when adding new features or fixing bugs.

## License

This project is licensed under the ISC License - see the LICENSE file for details.