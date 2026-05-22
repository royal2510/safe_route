# Clone and Run the Project

## 1. Clone the Repository

```bash
https://github.com/royal2510/safe_route
```

## 2. Open the Project Folder

```bash
cd safe_route
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Build the Docker Image

```bash
docker build -t safe-route-ai .
```

## 5. Run the Jenkins Pipeline

In Jenkins:

1. Create a new **Pipeline** job.
2. Select **Pipeline script from SCM**.
3. Choose **Git**.
4. Paste your GitHub repository URL.
5. Set the branch to:

```text
main
```

6. Save the pipeline.
7. Click:

```text
Build Now
```

## 6. Access the Application

Open:

```text
http://localhost:3000
```

## 7. Demo Login

```text
Email: demo@saferoute.com
Password: password123
```

## 8. Verify Docker Containers

```bash
docker ps
```

You should see:

```text
safe-route-ai
safe-route-mongo
```

## 9. Monitor the Application

Health endpoint:

```text
http://localhost:3000/health
```

The Jenkins pipeline automatically checks this endpoint during the Monitoring stage.

