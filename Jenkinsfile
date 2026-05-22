pipeline {
    agent any
    environment {
        APP_NAME = "safe-route-ai"
        DOCKER_IMAGE = "safe-route-ai:${BUILD_NUMBER}"
        DOCKER_LATEST = "safe-route-ai:latest"
        SONAR_PROJECT_KEY = "safe-route-ai"
    }
    stages {
        stage('Checkout') { steps { checkout scm } }
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'docker build -t $DOCKER_IMAGE -t $DOCKER_LATEST .'
                archiveArtifacts artifacts: 'package.json,Dockerfile,Jenkinsfile', fingerprint: true
            }
        }
        stage('Test') {
            steps { sh 'npm test' }
            post { always { archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true } }
        }
        stage('Code Quality') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                    sonar-scanner \
                    -Dsonar.projectKey=$SONAR_PROJECT_KEY \
                    -Dsonar.sources=. \
                    -Dsonar.exclusions=node_modules/**,coverage/** \
                    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }
        stage('Security') {
            steps {
                sh 'npm audit --audit-level=moderate || true'
                sh 'trivy image $DOCKER_LATEST || true'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d --build'
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
                sh 'docker logs safe-route-ai --tail 50 || true'
            }
        }
    }
    post {
        success { emailext(subject: "SUCCESS: Safe Route AI Pipeline #${BUILD_NUMBER}", body: "The Safe Route AI pipeline completed successfully.", to: "your_email@gmail.com", attachLog: true) }
        failure { emailext(subject: "FAILED: Safe Route AI Pipeline #${BUILD_NUMBER}", body: "The Safe Route AI pipeline failed. Please check the attached log.", to: "your_email@gmail.com", attachLog: true) }
    }
}
