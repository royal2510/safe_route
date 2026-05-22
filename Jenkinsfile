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
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'docker build -t $DOCKER_IMAGE -t $DOCKER_LATEST .'
                archiveArtifacts artifacts: 'package.json,Dockerfile,Jenkinsfile', fingerprint: true
            }
        }

        stage('Test') {
            steps {
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
                sh '''
                echo "Listing JavaScript files..."
                find . -name "*.js" -not -path "./node_modules/*" -not -path "./coverage/*"

                echo "Checking TODO comments..."
                grep -R "TODO" . --include="*.js" --exclude-dir=node_modules --exclude-dir=coverage || true

                echo "Code quality stage completed."
                '''
            }
        }

        stage('Security') {
            steps {
                sh 'npm audit --audit-level=moderate || true'

                sh '''
                if command -v trivy >/dev/null 2>&1; then
                    trivy image $DOCKER_LATEST || true
                else
                    echo "Trivy not installed. Skipping image scan."
                fi
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker stop safe-route-ai || true'
                sh 'docker rm safe-route-ai || true'
                sh 'docker run -d --name safe-route-ai -p 3000:3000 $DOCKER_LATEST'
            }
        }

        stage('Release') {
            steps {
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
                sh 'sleep 10'
                sh 'curl -f http://localhost:3000/health'
                sh 'docker ps'
                sh 'docker logs safe-route-ai --tail 50 || true'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check console output.'
        }

        always {
            echo 'Pipeline finished.'
        }
    }
}
