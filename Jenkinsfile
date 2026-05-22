pipeline {
    agent any

    environment {
        APP_NAME = "safe-route-ai"
        MONGO_NAME = "safe-route-mongo"
        NETWORK_NAME = "safe-route-network"
        DOCKER_IMAGE = "safe-route-ai:${BUILD_NUMBER}"
        DOCKER_LATEST = "safe-route-ai:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'

                echo 'Building Docker image...'
                sh 'docker build -t $DOCKER_IMAGE -t $DOCKER_LATEST .'

                archiveArtifacts artifacts: 'package.json,Dockerfile,Jenkinsfile', fingerprint: true
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests...'
                sh 'npm test'
            }

            post {
                always {
                    archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
                }
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Running basic code quality check...'
                sh '''
                echo "Listing JavaScript files..."
                find . -name "*.js" -not -path "./node_modules/*" -not -path "./coverage/*"

                echo "Checking TODO comments..."
                grep -R "TODO" . --include="*.js" --exclude-dir=node_modules --exclude-dir=coverage || true

                echo "Code quality stage completed successfully."
                '''
            }
        }

        stage('Security') {
            steps {
                echo 'Running dependency security scan...'
                sh 'npm audit --audit-level=moderate || true'

                echo 'Running Docker image security scan if Trivy is installed...'
                sh '''
                if command -v trivy >/dev/null 2>&1; then
                    trivy image $DOCKER_LATEST || true
                else
                    echo "Trivy is not installed. Skipping Docker image scan."
                fi
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying MongoDB and Safe Route AI with docker run...'

                sh 'docker stop $APP_NAME $MONGO_NAME || true'
                sh 'docker rm $APP_NAME $MONGO_NAME || true'

                sh 'docker network create $NETWORK_NAME || true'

                sh '''
                docker run -d \
                  --name $MONGO_NAME \
                  --network $NETWORK_NAME \
                  -p 27017:27017 \
                  mongo:7
                '''

                sh '''
                docker run -d \
                  --name $APP_NAME \
                  --network $NETWORK_NAME \
                  -p 3000:3000 \
                  -e PORT=3000 \
                  -e MONGO_URI=mongodb://safe-route-mongo:27017/saferoute \
                  -e JWT_SECRET=safe-route-secret \
                  -e NODE_ENV=production \
                  $DOCKER_LATEST
                '''

                sh 'sleep 15'

                echo 'Current Docker containers:'
                sh 'docker ps -a'

                echo 'Application logs:'
                sh 'docker logs $APP_NAME --tail 80 || true'
            }
        }

        stage('Release') {
            steps {
                echo 'Creating local release tag...'
                sh '''
                git config user.email "jenkins@example.com"
                git config user.name "Jenkins CI"

                git tag -f release-${BUILD_NUMBER}

                echo "Created local release tag release-${BUILD_NUMBER}"
                '''
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Checking deployed application health...'

                sh 'sleep 10'

                echo 'Docker container status:'
                sh 'docker ps -a'

                echo 'Recent app logs:'
                sh 'docker logs $APP_NAME --tail 80 || true'

                echo 'Testing /health endpoint inside app container using Node.js:'
                sh '''
                docker exec $APP_NAME node -e "
                fetch('http://localhost:3000/health')
                  .then(res => {
                    if (!res.ok) process.exit(1);
                    return res.json();
                  })
                  .then(data => {
                    console.log(JSON.stringify(data, null, 2));
                  })
                  .catch(err => {
                    console.error(err);
                    process.exit(1);
                  });
                "
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check the console output above.'
            sh 'docker ps -a || true'
            sh 'docker logs safe-route-ai --tail 100 || true'
        }

        always {
            echo 'Pipeline finished.'
        }
    }
}
