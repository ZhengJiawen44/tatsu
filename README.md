![CI](https://github.com/zhengjiawen44/tatsu/actions/workflows/publish.yml/badge.svg)
![Tests](https://github.com/zhengjiawen44/tatsu/actions/workflows/test.yml/badge.svg)
![License](https://img.shields.io/github/license/zhengjiawen44/tatsu)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

# Tatsu - The Ultimate Todo App

![hero](public/hero.webp)
[demo video](https://www.youtube.com/watch?v=NWD6fUluXuE)
## Introduction
Tatsu is a todo app on steroids, designed to keep you motivated and productive.

## Features

1. **Natural Language Processing**  
   Automatically extracts dates, times, and durations from your input. Just type naturally and the system handles the rest.

2. **Calendar View**  
   View all your tasks at a glance with monthly, weekly, and daily layouts to stay organized.

3. **Notion-like Editor**  
   A powerful and intuitive editor for structured note-taking and task management.

4. **End-to-End Encrypted File Uploads**  
   Securely upload and manage files with full end-to-end encryption to protect your data.

   More exciting features coming soon.

## Documentation
https://sanity.my/en/blogs

## RoadMap
https://github.com/ZhengJiawen44/tatsu/wiki/Roadmap

## Running with prebuilt Docker image (recommended)

You can run the prebuilt image directly from GitHub Container Registry:

```bash
docker run -d \
  --name tatsu \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  ghcr.io/zhengjiawen44/tatsu:latest
```

## Building and running a docker image yourself
alternatively, you can build the image yourself.
The project includes a **Dockerfile** and **docker-compose.yml** for containerized development.

Make sure **Docker** and **Docker Compose** are installed.

Copy **.env.example** to **.env** and fill in the required values (AWS credentials, database URL, etc.).

**Note**: Ensure DATABASE_URL in your .env matches the values in docker-compose.yml. If you haven't changed anything there, simply use the one provided in .env.example.

Build and start the containers:
```bash
docker compose up --build
```

This will:
- Start a Postgres database (postgres:15) with persistent storage.
- Start the Next.js app inside a Node.js container.
- Run Prisma migrations automatically on startup.

Once running, the app will be available at http://localhost:3000.

To stop the containers:
```bash
docker compose down
```

## Running Locally

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 12+ installed

### PostgreSQL Setup

#### 1. Install PostgreSQL (Fedora/RHEL)
```bash
sudo dnf install postgresql postgresql-server
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

For other operating systems, refer to the [official PostgreSQL documentation](https://www.postgresql.org/download/).

#### 2. Configure PostgreSQL Authentication
**Note**: This step may not be necessary depending on your PostgreSQL installation. If you can already connect using `psql -U myuser -d mydb -h localhost -W` with a password, skip this step.
Edit the PostgreSQL configuration file to allow password authentication:

```bash
sudo nano /var/lib/pgsql/data/pg_hba.conf
```

Change the following lines from `ident` to `md5`:

```
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
```

Restart PostgreSQL to apply changes:

```bash
sudo systemctl restart postgresql
```

#### 3. Create Database User and Database

Connect to PostgreSQL as the postgres superuser:

```bash
sudo -u postgres psql
```

Create a user with a password and necessary privileges:

```sql
-- Create user with password
CREATE USER myuser WITH PASSWORD 'mypass';

-- Grant create database privilege (required for Prisma migrations)
ALTER USER myuser CREATEDB;

-- Create the database with myuser as owner
CREATE DATABASE mydb OWNER myuser;

-- Exit psql
\q
```

#### 4. Verify Connection

Test that you can connect with the new user:

```bash
psql -U myuser -d mydb -h localhost -W
```

Enter your password when prompted. If successful, you'll see the psql prompt. Type `\q` to exit.

### Application Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and update with your PostgreSQL credentials:
```bash
DATABASE_URL="postgresql://myuser:mypass@localhost:5432/mydb"
```

3. Run Prisma migrations to set up the database schema:
```bash
npx prisma migrate dev --name init
```

This will create all the necessary tables in your database.

4. Start the development server:
```bash
npm run dev
```

Then, open http://localhost:3000 in your browser.

### Additional Prisma Commands

- **Generate Prisma Client**: `npx prisma generate`
- **Open Prisma Studio** (database GUI): `npx prisma studio`
- **Reset database** (drops all data): `npx prisma migrate reset`

## Fonts
This project uses next/font for optimized font loading. It features Poppins, a modern and elegant font from Google.
