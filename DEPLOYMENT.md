# Deployment Guide (Production)

## Environment
- Set `MONGO_URI` to your production MongoDB connection string.
- Set `JWT_SECRET` to a secure random string.
- Set `FRONTEND_URL` to your frontend domain.

## Recommended approach (Docker)
- Build and push `backend` and `frontend` images to your registry.
- Use `docker-compose` or Kubernetes for orchestration.

## Nginx reverse proxy example
server {
  listen 80;
  server_name yourdomain.com;
  location /api/ {
    proxy_pass http://backend:5000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  location /uploads/ {
    proxy_pass http://backend:5000/uploads/;
  }
  location / {
    proxy_pass http://frontend:3000/;
  }
}

## GitHub Actions / CI
- Use the provided `.github/workflows/ci.yml` as a starting point.
- Add secrets for production registry, and production environment variables.
