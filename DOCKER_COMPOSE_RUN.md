# How to Run Activepieces with Docker Compose

## Quick Start

### Option 1: Automated Setup (Windows)

```powershell
.\setup-windows.ps1
```

This script will:
- Check Docker installation
- Generate secure `.env` file
- Start all services with Docker Compose

### Option 2: Manual Setup

#### Step 1: Create `.env` file

Create a `.env` file in the root directory with the following content:

```env
# Activepieces Configuration
AP_API_KEY=your-api-key-here
AP_POSTGRES_DATABASE=activepieces
AP_POSTGRES_USERNAME=activepieces
AP_POSTGRES_PASSWORD=your-secure-password-here
AP_POSTGRES_HOST=postgres
AP_POSTGRES_PORT=5432

# Redis Configuration
AP_REDIS_HOST=redis
AP_REDIS_PORT=6379
AP_REDIS_DB=0

# Security
AP_JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here

# Frontend/API URLs
AP_FRONTEND_URL=http://localhost
AP_API_URL=http://localhost/api

# Optional: Nginx Ports (if different from defaults)
# AP_NGINX_HTTP_PORT=80
# AP_NGINX_HTTPS_PORT=443
```

#### Step 2: Start Docker Compose

**Windows (PowerShell):**
```powershell
docker compose -p activepieces up -d
```

**Linux/Mac:**
```bash
docker compose -p activepieces up -d
```

**Or using the older syntax:**
```bash
docker-compose -p activepieces up -d
```

## What Gets Started

The Docker Compose setup starts 4 services:

1. **activepieces** - Main application server
2. **nginx** - Reverse proxy (ports 80/443)
3. **postgres** - PostgreSQL database
4. **redis** - Redis cache

## Common Commands

### View Logs
```bash
# All services
docker compose -p activepieces logs -f

# Specific service
docker compose -p activepieces logs -f activepieces
docker compose -p activepieces logs -f nginx
docker compose -p activepieces logs -f postgres
docker compose -p activepieces logs -f redis
```

### Stop Services
```bash
docker compose -p activepieces stop
```

### Start Services
```bash
docker compose -p activepieces start
```

### Restart Services
```bash
docker compose -p activepieces restart

# Restart specific service
docker compose -p activepieces restart nginx
```

### Stop and Remove Containers
```bash
docker compose -p activepieces down
```

### Stop and Remove Containers + Volumes (⚠️ Deletes Data)
```bash
docker compose -p activepieces down -v
```

### Rebuild and Start
```bash
# Rebuild activepieces image
docker compose -p activepieces build activepieces

# Then start
docker compose -p activepieces up -d
```

### View Running Containers
```bash
docker compose -p activepieces ps
```

## Access the Application

After starting, access Activepieces at:
- **http://localhost** (or your configured port)
- **http://localhost:8080** (if you changed the port)

## Troubleshooting

### Port Already in Use
If port 80 or 443 is already in use, change the ports in `.env`:
```env
AP_NGINX_HTTP_PORT=8080
AP_NGINX_HTTPS_PORT=8443
```

Then update `AP_FRONTEND_URL` and `AP_API_URL` accordingly.

### Container Won't Start
1. Check logs: `docker compose -p activepieces logs`
2. Verify `.env` file exists and has all required variables
3. Check Docker is running: `docker ps`
4. Check disk space: `docker system df`

### Database Connection Issues
- Verify PostgreSQL container is running: `docker compose -p activepieces ps postgres`
- Check PostgreSQL logs: `docker compose -p activepieces logs postgres`
- Verify `AP_POSTGRES_HOST=postgres` in `.env`

### Redis Connection Issues
- Verify Redis container is running: `docker compose -p activepieces ps redis`
- Check Redis logs: `docker compose -p activepieces logs redis`
- Verify `AP_REDIS_HOST=redis` in `.env`

### Nginx Configuration Issues
After modifying `nginx/conf.d/activepieces.conf`:
```bash
# Test nginx config
docker compose -p activepieces exec nginx nginx -t

# Reload nginx
docker compose -p activepieces restart nginx
```

## Updating

To update to the latest version:

```bash
# Pull latest images
docker compose -p activepieces pull

# Rebuild activepieces (if using build)
docker compose -p activepieces build activepieces

# Restart with new images
docker compose -p activepieces up -d
```

## Multi-Domain Setup

If you've configured multiple domains (Telugu, Hindi, Tamil, English), make sure:

1. DNS records point to your server
2. Nginx configuration is correct: `nginx/conf.d/activepieces.conf`
3. Restart nginx after changes: `docker compose -p activepieces restart nginx`

## Data Persistence

Data is stored in Docker volumes:
- `postgres_data` - Database data
- `redis_data` - Redis data
- `./cache` - Application cache (local directory)

To backup:
```bash
# Backup PostgreSQL
docker compose -p activepieces exec postgres pg_dump -U activepieces activepieces > backup.sql

# Backup volumes
docker run --rm -v activepieces_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
```

