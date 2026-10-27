# Haven Property

Haven Property is a property classifieds application for owner-listed homes
for rent and sale. Buyers can browse, filter, save, and inquire about listings;
owners can manage listings and respond to inquiries from a private dashboard.

## Features

- Browse featured and available properties
- Search and filter by listing type, property type, city, price, bedrooms, bathrooms, and furnished status
- View listing details and owner contact information
- Register and sign in as a buyer or owner
- Save and unsave listings
- Send and track buyer inquiries
- Manage owner listings, statuses, photos, amenities, and featured placement
- Review and reply to owner inquiries
- Update profile information and passwords
- Seeded demo data for local development

## Technology

- Frontend: React 18, React Router, Vite, Tailwind CSS
- Backend: Node.js, Express, SQLite via `better-sqlite3`
- Authentication: bcrypt password hashing and JWT in an httpOnly cookie named `haven_token`
- Testing: Node's built-in `node:test` runner
- Deployment: Multi-stage Docker image; Express serves the built frontend in production

## Project structure

```text
.
├── client/
│   ├── src/
│   │   ├── components/       Reusable UI components
│   │   ├── pages/            Buyer and owner screens
│   │   ├── api.js            Fetch client and formatting helpers
│   │   ├── auth.jsx          Auth state and route guards
│   │   ├── App.jsx           Frontend route definitions
│   │   └── Layout.jsx        Shared navigation and page shell
│   ├── public/               Static images and placeholders
│   └── vite.config.js        Dev server and API proxy configuration
├── server/
│   ├── src/
│   │   ├── routes/auth.js    Registration, login, profile, password APIs
│   │   ├── routes/listings.js Public listing, saved, and inquiry APIs
│   │   ├── routes/owner.js   Owner dashboard and management APIs
│   │   ├── auth.js           JWT and role-based authorization helpers
│   │   ├── db.js             SQLite connection, migrations, and mappers
│   │   ├── seed.js           Demo data generator
│   │   └── index.js          Express app entry point
│   └── test/                 Backend tests
├── Dockerfile                Production multi-stage image
├── docker-compose.yml         Container and persistent database volume
├── docker-entrypoint.sh       First-start database seeding
└── package.json               Root development scripts
```

## Requirements

- Node.js 22 recommended (the Docker image uses Node.js 22)
- npm
- Docker Desktop, if using the Docker workflow

## Local development

Install dependencies, create the server environment file, seed the database,
and start the frontend and API together:

```bash
npm install
cp server/.env.example server/.env
npm run seed
npm run dev
```

The local development URLs are:

- Frontend: http://localhost:5173
- API: http://localhost:4001
- Health check: http://localhost:4001/api/health

Vite proxies `/api` requests from the frontend to the API during development.

## Docker

Run the complete production application from the repository root:

```bash
docker compose up -d --build
```

Open http://localhost:4001. The first container start automatically loads the
demo data. SQLite is stored in the named `haven-property-data` volume so data
survives container restarts.

Useful commands:

```bash
docker compose ps             # Show service status
docker compose logs -f        # Follow application logs
docker compose down           # Stop and remove the container
docker compose down -v        # Stop and reset the SQLite volume
```

The image can also be built and run without Compose:

```bash
docker build -t haven-property .
docker run --rm -p 4001:4001 -v haven-property-data:/data haven-property
```

## Application routes

### Public and buyer routes

| Route | Purpose |
| --- | --- |
| `/` | Home page and featured listings |
| `/listings` | Search and filter listings |
| `/listings/:id` | Listing details and inquiry form |
| `/login` | Sign in |
| `/register` | Create a buyer or owner account |
| `/saved` | Saved listings; authentication required |
| `/inquiries` | Buyer inquiries; authentication required |
| `/profile` | Profile and password settings; authentication required |

### Owner routes

| Route | Purpose |
| --- | --- |
| `/owner` | Owner dashboard |
| `/owner/listings` | Manage owned listings |
| `/owner/listings/new` | Create a listing |
| `/owner/listings/:id/edit` | Edit a listing |
| `/owner/inquiries` | Review and reply to inquiries |

All owner routes require an authenticated account with the `owner` role.

## API overview

The API is mounted under `/api`:

- `/api/health` — database-backed health check
- `/api/auth` — register, login, logout, current user, profile, and password changes
- `/api/listings` — listing search, metadata, featured listings, details, saves, and inquiries
- `/api/owner` — owner dashboard, listing CRUD, status updates, and inquiry replies
- `/api/me` — current buyer's saved listings and inquiries

Authentication uses the `haven_token` httpOnly cookie. Frontend requests include
credentials automatically.

## Environment variables

Create `server/.env` from `server/.env.example` for local development:

| Variable | Purpose | Local default |
| --- | --- | --- |
| `PORT` | API listening port | `4001` |
| `JWT_SECRET` | Secret used to sign login tokens | Set a private value |
| `CLIENT_ORIGIN` | Allowed browser origin for CORS | `http://localhost:5173` |
| `DATABASE_PATH` | SQLite file path, relative to `server/` unless absolute | `./data/property.db` |
| `COOKIE_SECURE` | Set secure cookies when serving over HTTPS | `false` |

For production, set a strong `JWT_SECRET`, use HTTPS, set
`COOKIE_SECURE=true`, and set `CLIENT_ORIGIN` to the real frontend origin.

## Demo accounts

The seed script uses `Password123!` for every seeded account:

| Role | Email |
| --- | --- |
| Owner | `maya.chen@haven.test` |
| Owner | `james.okonkwo@haven.test` |
| Buyer | `alex.nguyen@haven.test` |
| Buyer | `jordan.lee@haven.test` |

The seed contains 8 owners, 12 buyers, 108 listings, inquiries, and saved
listings.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Node watch mode and the Vite frontend |
| `npm run dev:server` | Start only the API |
| `npm run dev:client` | Start only the frontend |
| `npm run seed` | Recreate the SQLite database and load demo data |
| `npm test` | Run backend tests |
| `npm run build` | Build the frontend for production |

To run package-level scripts directly, use `npm run <script> --prefix client`
or `npm run <script> --prefix server`.
