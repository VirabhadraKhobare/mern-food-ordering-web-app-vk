# MERN Food App

Minimal scaffold for a food-ordering MERN app (backend + frontend). See /backend and /frontend folders.


## Added features

- Owner Dashboard frontend pages (My Dishes, Add Dish, Orders Received, Earnings).
- `backend/seed.js` script to seed the database with example users, restaurant, dishes and an order.
- Dockerfiles for frontend and backend and `docker-compose.yml` for local testing (Mongo + backend + frontend).

### Seed DB
Run from backend folder:
```
node seed.js
```

### Docker compose
From project root:
```
docker-compose up --build
```


## Upgrades added

- Image upload via Multer in owner `/owner/dishes` (send multipart/form-data with field `image`).
- Uploaded files served at `/uploads/<filename>`.
- Redux Toolkit for auth & cart. ProtectedRoute component added.
- Tailwind CSS configured for frontend styling.
- Basic tests and GitHub Actions CI workflow (.github/workflows/ci.yml).
- Production deployment notes in DEPLOYMENT.md and backend/Procfile.

## Run locally with Docker Compose (recommended)
1. Ensure Docker & Docker Compose installed.
2. From project root, run:
   ```bash
   docker-compose up --build
   ```
   This builds frontend and backend, starts MongoDB on port 27017, backend on 5000, frontend on 3000.
3. Seed the database (inside backend container or locally):
   ```bash
   # if running locally with node:
   cd backend
   node seed.js
   # or inside docker (replace container id/name accordingly)
   docker exec -it <backend_container> node seed.js
   ```
4. Open http://localhost:3000 for frontend.
5. Seeded accounts: owner `shahirasoi@gmail.com` / `password123`, customer `krishnagupta79822@gmail.com` / `password123`.

## Notes on S3 uploads
- If you set AWS_S3_BUCKET and AWS credentials in `backend/.env`, uploads will be placed in S3 and public URL used.
- Otherwise uploads are stored under `backend/uploads` and served at `/uploads/`.

## Running tests locally (backend)
From `backend` run:
```bash
npm install
MONGO_URI=mongodb://localhost:27017/mern_food_app_test node --test
```
CI will run backend tests automatically and fail the workflow on test failures.
