# RepoRadar 🚀

**RepoRadar** is a full-stack Next.js application that helps you explore GitHub repositories using intelligent filters and Gemini AI integration. Built with Docker, it supports end-to-end CI/CD using GitHub Actions and deploys directly to an AWS EC2 instance.

---

## 🌟 Features

- 🔍 Search GitHub repositories by:
  - Keyword
  - Language
  - Star count
  - Topic
-  Powered by the [Gemini API](https://ai.google.dev) to enhance prompts or content generation
-  Fully containerized using **Docker**
-  Secrets managed via GitHub Actions + `.env.local`
-  Auto-deployment to **EC2** via **self-hosted runner**

---

## 🛠 Tech Stack

- **Frontend/Backend**: [Next.js](https://nextjs.org/) (App Router)
- **AI**: Google Gemini API
- **Deployment**: Docker, GitHub Actions, EC2 (self-hosted runner)
- **Language**: TypeScript

---

## 🧪 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/avirup-ghosal/RepoRadar.git
cd RepoRadar/my-app
```
### 2. Create .env.local
```env
GEMINI_API_KEY=your_api_key_here
```
### 3. Install dependencies
```bash
npm install
```
### 4. Run the app
```bash
npm run dev
```
### 5. Docker Usage
```bash
docker build -t your-dockerhub-username/my-nextjs-app ./my-app
```
### 6. Run the container
```bash
docker run -d -p 3000:3000 --name my-nextjs-app -e GEMINI_API_KEY=your_api_key your-dockerhub-username/my-nextjs-app
```
## CI/CD (GitHub Actions)
RepoRadar uses two GitHub Actions jobs:

1. Build & Push:

  - Injects .env.local

  - Builds the Docker image

  - Pushes to Docker Hub

2. Deploy on EC2 (self-hosted runner):

  - Pulls image

  - Stops existing container

  - Runs the latest image on port 3005
