![CI](https://github.com/zhengjiawen44/tatsu/actions/workflows/publish.yml/badge.svg)
![Tests](https://github.com/zhengjiawen44/tatsu/actions/workflows/test.yml/badge.svg)
[![CodeFactor](https://www.codefactor.io/repository/github/zhengjiawen44/tatsu/badge/main)](https://www.codefactor.io/repository/github/zhengjiawen44/tatsu/overview/main)
![License](https://img.shields.io/github/license/zhengjiawen44/tatsu)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Last Commit](https://img.shields.io/github/last-commit/zhengjiawen44/tatsu)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

# Tatsu - The Ultimate Todo App

![hero](public/hero.webp)
[demo video](https://www.youtube.com/watch?v=NWD6fUluXuE)
## 1. Introduction
Tatsu is a todo app on steroids, designed to keep you motivated and productive.

## 2. Features

1. **Natural Language Processing**  
   Automatically extracts dates, times, and durations from your input. Just type naturally and the system handles the rest.

2. **Calendar View**  
   View all your tasks at a glance with monthly, weekly, and daily layouts to stay organized.

3. **Notion-like Editor**  
   A powerful and intuitive editor for structured note-taking and task management.

4. **End-to-End Encrypted File Uploads**  
   Securely upload and manage files with full end-to-end encryption to protect your data.

   More exciting features coming soon!!

## 3. Documentation
https://sanity.my/en/blogs

## 4. RoadMap
https://github.com/ZhengJiawen44/tatsu/wiki/Roadmap

## 5. Deploying with Docker

1. Download the `docker-compose.yml` file from this repository.

2. Copy `.env.example` to `.env` and fill in the required values.

3. Start the containers:
```bash
docker compose up -d
```

This will:
- Pull the latest prebuilt image from GitHub Container Registry.
- Start a Postgres database (postgres:15) with persistent storage.
- Run Prisma migrations automatically on startup.

Once running, the app will be available at http://localhost:3000.

To stop the containers:
```bash
docker compose down
```

## 6. Local Development with Docker (hot module referesh supported)
contributing to the project is exceedingly easy.
1. Git clone this repository
2. Copy `.env.example` to `.env` and fill in the required values.
3. start the dev server `docker compose -f docker-compose.dev.yml up`
4. make edits to the code base and see changes in real time.

To stop the dev server `docker compose -f docker-compose.dev.yml down`

## 7. Running Locally without Docker
this guide is too long, you can find it [here](https://github.com/ZhengJiawen44/tatsu/wiki)

## 8. Fonts
This project uses next/font for optimized font loading. It features Poppins, a modern and elegant font from Google.
