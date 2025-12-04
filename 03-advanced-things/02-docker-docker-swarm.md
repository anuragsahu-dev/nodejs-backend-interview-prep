# Docker & Docker Swarm

## What is Docker?

Docker is a **containerization platform** that packages an application and its dependencies into a lightweight, portable container, so the app runs consistently on any environment (dev → test → prod).

### What Problems Does Docker Solve?

**1. "Works on my machine" Problem**

- Developer's code works locally but fails in production
- Different Node versions, missing dependencies, OS differences
- Docker ensures the **same environment everywhere**

**2. Dependency Conflicts**

- App A needs Python 3.8, App B needs Python 3.10
- Docker **isolates** each app in its own container with its own dependencies

**3. Environment Setup Complexity**

- New developer spends hours setting up: Node, PostgreSQL, Redis, etc.
- With Docker: `docker compose up` → everything ready in minutes

**4. Deployment Inconsistency**

- Production server has different OS, libraries, or configurations
- Docker container runs **identically** on any machine

### Is Docker Linux-Based?

**Yes, Docker uses Linux kernel features**, specifically:

- **Namespaces:** Isolate processes (each container has its own process tree)
- **Cgroups:** Limit resources (CPU, memory, disk I/O)
- **Union File Systems:** Layer images efficiently

**On Windows/Mac:** Docker Desktop runs a lightweight Linux VM in the background to provide these kernel features.

**Key Point:** Containers share the host OS kernel (unlike VMs which run a full OS), making them lightweight and fast.

## What is a Docker Image?

A **Docker Image** is a **read-only template** that contains:

- Application code
- Runtime (e.g., Node.js)
- System libraries
- Dependencies (npm packages)
- Configuration files

**Think of it as:** A snapshot or blueprint of your application.

**Example:** `node:20` image contains Node.js 20 runtime and basic Linux utilities.

### How Images Work

```
Dockerfile (instructions) → Build → Image (immutable template)
```

**Characteristics:**

- **Immutable:** Once built, cannot be changed (must rebuild for changes)
- **Layered:** Each Dockerfile instruction creates a layer
- **Shareable:** Can be pushed to Docker Hub or private registries
- **Versioned:** Tagged (e.g., `myapp:v1.0`, `myapp:latest`)

## What is a Docker Container?

A **Docker Container** is a **running instance** of an image. It's an isolated process with its own:

- File system
- Network interface
- Process space
- Resource limits

**Think of it as:** A running application created from the image blueprint.

### How Containers Work

```
Image (template) → docker run → Container (running process)
```

**Characteristics:**

- **Ephemeral:** Data is lost when container stops (unless using volumes)
- **Isolated:** Cannot interfere with other containers or host
- **Lightweight:** Shares host OS kernel, starts in seconds
- **Multiple instances:** Can run many containers from one image

## Image vs Container (Detailed)

| Aspect          | Image                        | Container                               |
| --------------- | ---------------------------- | --------------------------------------- |
| **Definition**  | Read-only template/blueprint | Running instance of an image            |
| **State**       | Static, immutable            | Dynamic, can be started/stopped         |
| **Analogy**     | Class (in OOP)               | Object/Instance (in OOP)                |
| **Storage**     | Stored on disk               | Running in memory                       |
| **Layers**      | Built in layers, cached      | Uses image layers + writable layer      |
| **Persistence** | Permanent until deleted      | Data lost when removed (unless volumes) |
| **Creation**    | Built from Dockerfile        | Created from image using `docker run`   |
| **Quantity**    | One image                    | Many containers from one image          |

### Practical Example

```bash
# Build an image (blueprint)
docker build -t myapp:v1 .

# Run multiple containers from the same image
docker run -d --name app1 myapp:v1
docker run -d --name app2 myapp:v1
docker run -d --name app3 myapp:v1
```

**Result:** 1 image → 3 running containers (each isolated)

### Key Differences Explained

**Image:**

- Like a recipe or blueprint
- Cannot run by itself
- Shared across containers
- Example: `node:20`, `postgres:15`, `myapp:latest`

**Container:**

- Like a dish made from the recipe
- Actually runs your application
- Each has its own state
- Example: `app1`, `app2`, `database_container`

**Analogy:**

- **Image** = Music CD (read-only)
- **Container** = Music playing from CD (active process)

## Why Use Docker?

- **Consistency:** Same environment across dev, test, and production
- **Isolation:** Apps and dependencies don't conflict with each other
- **Lightweight:** Faster startup and less overhead compared to VMs (shares OS kernel)
- **Portability:** Run anywhere Docker is installed (Linux, Windows, Mac, cloud)
- **Easy Composition:** Run multiple services (DB, cache, app) with Docker Compose
- **CI/CD Ready:** Automated testing and deployment
- **Scalability:** Easy to scale with orchestration tools (Swarm/Kubernetes)
- **Version Control:** Images are versioned and reproducible

## Dockerfile & Layers

A **Dockerfile** is a script of instructions (`FROM`, `RUN`, `COPY`, `CMD`, etc.) to create an image. Each instruction creates a layer.

### Why Layers Matter

- **Caching:** Reusing layers speeds up rebuilds
- **Size:** Fewer/combined `RUN` commands make smaller images
- **Order:** Put stable steps early (install deps), volatile steps later (copy app code)

### Best Practices

- Combine package installations into one `RUN` command
- Use `.dockerignore` to exclude unnecessary files
- Use **multi-stage builds** for production (builder → runner) to keep final image small

## Storage: Volumes vs Bind Mounts

### Volume (Docker-managed)

- Managed by Docker, stored in `/var/lib/docker/volumes/`
- **Use for:** Database data, persistent storage in production
- **Benefits:** Portable between hosts, safer than bind mounts

### Bind Mount (Host ↔ Container)

- Maps a host folder (e.g., `./`) into the container
- **Use for:** Development (hot-reload without rebuilding)
- **Drawback:** Not portable, depends on host path and permissions

```
Host: ./src  <----bind mount---->  Container: /app/src
```

**Why use bind mount in dev?** Allows live code editing without rebuilding the image. Code changes on host immediately reflect in container.

### Container Storage

- **Container FS:** Ephemeral (lost if container removed)
- **Volumes:** Persistent, recommended for production
- **Bind mounts:** Development convenience only

## Docker Networks

### Bridge (Default)

- Single-host internal network
- Containers on same bridge communicate via container name
- Used in `docker run` and local Compose setups

### Overlay

- Multi-host network for Swarm/Kubernetes
- Allows containers on different hosts to communicate
- Useful for distributed apps and service discovery

**Note:** Compose auto-creates a default bridge network.

## Docker Compose

**Docker Compose** runs multi-container apps defined in a YAML file (`docker-compose.yml` or `compose.yaml`).

### Why Use Compose?

- Start entire app stack (DB + backend + cache + queue) with one command
- Local environment parity
- Simple orchestration for small apps

### Common Commands

```bash
docker compose up -d          # Start services in background
docker compose down           # Stop and remove containers
docker compose logs -f        # Follow logs
docker compose ps             # List running services
docker compose build          # Build images
docker compose exec app sh    # Execute command in service
```

## Docker Swarm

**Docker Swarm** is Docker's native clustering/orchestration tool. It runs services across multiple nodes (managers + workers) with scaling, rolling updates, secrets, and load balancing.

### Swarm Load Balancing

- Swarm creates an **ingress routing network** when you publish a service port
- Assigns a **Virtual IP (VIP)** for the service
- **Routing mesh** (IPVS) distributes incoming requests to service tasks across the cluster
- Can use external load balancers (NGINX, cloud LB) for advanced routing

**Interview Tip:** "Swarm provides built-in load balancing via the routing mesh; for advanced LB, use external load balancers like Traefik or NGINX."

## Orchestration

**Orchestration** automates deploying, scaling, updating, and managing containers in production.

**Features:** Scheduling, health checks, service discovery, rolling updates

**Tools:**

- **Docker Swarm:** Simpler, built into Docker
- **Kubernetes:** Full-featured, more common in larger infrastructure

## Kubernetes (Brief)

Kubernetes is a powerful orchestration system for automating deployment, scaling, and operations of containerized workloads across clusters. It provides pods, services, deployments, ConfigMaps, secrets, and a richer ecosystem than Swarm.

**For junior interviews:** Concept-level understanding is sufficient.

## Docker Secrets

**Docker Secrets** store sensitive values securely and mount them as files under `/run/secrets/<name>` inside containers.

### Why Secrets vs Environment Variables?

- Environment variables can leak in logs and `docker inspect`
- Secrets are stored encrypted in Swarm
- Exposed only to containers that need them

### Example Configuration

```yaml
services:
  task-manager-server:
    image: myimage:latest
    secrets:
      - database_url
      - access_token_secret

secrets:
  database_url:
    external: true
  access_token_secret:
    external: true
```

### Reading Secrets in Node.js

```javascript
import fs from "fs";

function readSecret(name) {
  try {
    return fs.readFileSync(`/run/secrets/${name}`, "utf8").trim();
  } catch (e) {
    return undefined;
  }
}

const config = {
  DATABASE_URL: readSecret("database_url"),
  ACCESS_TOKEN_SECRET: readSecret("access_token_secret"),
  SMTP_USER: readSecret("smtp_user"),
};
```

**Container sees:**

```
/run/secrets/database_url
/run/secrets/access_token_secret
```

## Common Docker Commands

### Image & Build

```bash
docker build -t myapp:tag .
docker images
docker rmi <image>
docker pull <image>
```

### Run & Containers

```bash
docker run -d --name myapp -p 3000:3000 myapp:tag
docker ps
docker stop <container>
docker rm <container>
docker logs -f <container>
docker exec -it <container> sh
```

### Volumes & Networks

```bash
docker volume ls
docker volume inspect <volume>
docker network ls
docker network inspect <network>
```

### Swarm

```bash
docker swarm init
docker stack deploy -c docker-compose.yml mystack
docker service ls
docker service scale myservice=3
```

## Development Dockerfile Example

```dockerfile
FROM node:24

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
```

**Note:** Use bind mount in Compose for live updates without rebuilding.

## Production Dockerfile (Multi-stage)

```dockerfile
# Builder stage
FROM node:22-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN npm run build

# Runner stage
FROM node:22-slim AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

**Benefits:** Smaller final image by copying only built artifacts.

## Development Compose Example

```yaml
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: nestdb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - app_network

  redis:
    image: redis:8
    ports:
      - "6379:6379"
    networks:
      - app_network

  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app # Bind mount for live updates
      - /app/node_modules # Exclude node_modules
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - postgres
      - redis
    networks:
      - app_network

volumes:
  pgdata:

networks:
  app_network:
```

## Production Compose with Secrets

```yaml
version: "3.8"

services:
  redis:
    image: redis:7.2
    deploy:
      replicas: 1
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 1m
      timeout: 10s
      retries: 3
    volumes:
      - redis-data:/data
    networks:
      - app-net

  app:
    image: myapp:latest
    deploy:
      replicas: 2
      update_config:
        order: start-first
        failure_action: rollback
        delay: 10s
    environment:
      - NODE_ENV=production
      - REDIS_HOST=redis
      # Use _FILE pattern for secrets
      - DATABASE_URL_FILE=/run/secrets/database_url
      - ACCESS_TOKEN_SECRET_FILE=/run/secrets/access_token_secret
    networks:
      - app-net
    secrets:
      - database_url
      - access_token_secret

networks:
  app-net:

volumes:
  redis-data:

secrets:
  database_url:
    external: true
  access_token_secret:
    external: true
```

## Interview Quick Reference

| Term               | Definition                                                   |
| ------------------ | ------------------------------------------------------------ |
| **Docker**         | Platform to build and run containers                         |
| **Container**      | Running instance of an image (isolated process)              |
| **Image**          | Immutable template built from a Dockerfile                   |
| **Volume**         | Docker-managed persistent storage                            |
| **Bind Mount**     | Host directory mounted into container (dev use)              |
| **Docker Compose** | Tool to define/run multi-container apps via YAML             |
| **Orchestration**  | Automating scheduling, scaling, and management of containers |
| **Docker Swarm**   | Docker's cluster/orchestration tool (simpler than K8s)       |
| **Kubernetes**     | Full-featured orchestration platform for large clusters      |
| **Docker Secret**  | Secure file-based secret exposed at `/run/secrets/<name>`    |

## Interview Tips

- **Bind mount vs Volume:** Bind mount for dev (live updates), volume for prod (persistence)
- **Multi-stage builds:** Reduces image size by copying only final artifacts
- **Secrets:** Read from `/run/secrets` in Node.js (filesystem read, not env vars)
- **Swarm vs K8s:** Swarm is simpler, Kubernetes is feature-rich — depends on company needs
- **New command:** Use `docker compose` (not `docker-compose`)
