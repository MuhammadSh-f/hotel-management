# Hotel Management System

**Description**
A comprehensive web-based solution for managing hotel operations, built using modern technologies and clean architecture.

**Technologies**

- **Backend**: Node.js with Express framework
- **Database**: MongoDB via Mongoose ODM
- **Authentication**: JWT-based security with bcryptjs hashing
- **Validation**: Schema validation with Zod library
- **Type Safety**: Full TypeScript implementation
- **Dev Tools**: TypeScript development with ts-node-dev

**Core Modules**

1. `bookings` module - Handles user reservations, room availability, and cancellation
2. `invoice` module - Manages payment processing and billing
3. `auth` module - User authentication and authorization
4. `middlewares` - Custom middleware for request validation and security

**Key Routes**

- `POST /bookings` - Create new reservation (requires auth)
- `GET /bookings` - List user's active bookings
- `GET /bookings/admin/all` - Retrieve all bookings (admin only)
- `GET /bookings/:id` - View specific booking details
- `DELETE /bookings/:id` - Cancel reservation

**Security Features**

- JWT token validation middleware
- Input validation with Zod schemas
- Role-based access control (admin privileges)
- Password hashing with bcryptjs

**Installation**

1. Clone repository
2. Install dependencies: `npm install`
3. Configure `.env` file with database credentials
4. Start server: `npm run dev`

**Usage**

- Guests: Book rooms through web portal
- Staff: Manage reservations and view occupancy
- Admins: Access analytics and manage users

**Contributing**

- Fork the repository
- Create feature branches
- Submit pull requests

**License**
[MIT License](https://choosealicense.com/licenses/mit/)
