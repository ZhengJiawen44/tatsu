# Tatsu - The Ultimate Todo App
This is a Next.js project bootstrapped with create-next-app. A live preview of this is available on [tatsu-gg.vercel.app](https://tatsu-gg.vercel.app/)

## Introduction
Tatsu is a todo app on steroids, designed to keep you motivated and productive. Key features include:

**Evolving Avatars**: Your avatar grows as you complete your todo goals (TBD).

**Long-term Todo Tracking**: Stay on top of your big-picture tasks (TBD).

**Notion-like Editor**: A powerful, intuitive interface for note taking.

**End-to-End Encrypted File Uploads**: Securely store and manage your files.

More exciting features coming soon! 

## End to End encryption
All files are end to end encrypted and stored in a aws s3 bucket. the module designated for retrieval, and encryption/decryption of files is called "Vault" in the app. you can read more about how I implemented it [here](https://excalidraw.com/#room=8feca98c331feac8d27b,XeidBTw8Bp2qXTVBjf41Yg)

![e2ee](images/e2ee1.png)![e2ee](images/e2ee2.png)

## RoadMap
https://github.com/ZhengJiawen44/tatsu/wiki/Roadmap

## Running with Docker (Recommended)

You can run the prebuilt image directly from GitHub Container Registry:

```bash
docker run -d \
  --name tatsu \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  ghcr.io/zhengjiawen44/tatsu:latest
```

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
