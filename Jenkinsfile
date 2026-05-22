pipeline {
    agent any

    environment {
        APP_NAME = "safe-route-ai"
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

                echo "Checking for TODO comments..."
                grep -R "TODO" . --include="*.js" --exclude-dir=node_modules --exclude-dir=coverage || true

                echo "Code quality stage completed successfully."
                '''
            }
        }

        stage('Security') {
            steps {
                echo 'Running dependency security scan...'
                sh 'npm audit --audit-level=moderate || true'

                echo 'Running Docker image security scan...'
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
                echo 'Deploying with Docker Compose...'

                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
            }
        }

        stage('Release') {
            steps {
                echo 'Creating release tag...'

                sh '''
                git config user.email "jenkins@example.com"
                git config user.name "Jenkins CI"

                git tag -f release-${BUILD_NUMBER}
                git push origin release-${BUILD_NUMBER} || true
                '''
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Checking deployed application health...'
                sh 'sleep 10'

                echo 'Testing /health endpoint...'
                sh 'curl -f http://localhost:3000/health'

                echo 'Checking Docker containers...'
                sh 'docker ps'

                echo 'Showing recent application logs...'
                sh 'docker logs safe-route-ai --tail 50 || true'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check the console output above.'
        }

        always {
            echo 'Pipeline finished.'
        }
    }
}
