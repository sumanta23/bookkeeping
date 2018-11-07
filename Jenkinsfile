pipeline {
    agent any
    environment {
        CI = 'true'
    }
    stages {
        stage('Test') {
            steps {
                script {
                    docker.image('mongo').withRun { c ->
                        docker.image('node:8-alpine').inside("--link ${c.id}:db") {
                            sh 'npm install'
                            sh 'cat /etc/hosts'
                            sh 'MONGODB_HOST=db npm test'
                            junit '**/jenkins-test-results.xml'
                        }
                    }
                }
            }
        }
        stage('Deliver') {
            steps {
                sh 'echo "done"'
            }
        }
    }
    post {
        always {
            junit '**/jenkins-test-results.xml'
        }
    }
}
