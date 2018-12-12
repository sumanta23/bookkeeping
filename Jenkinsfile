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
                            sh 'MONGODB_HOST=db npm run coverage'
                            sh 'MONGODB_HOST=db npm run allure'
                        }
                    }
                }
                publishHTML target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: false,
                    keepAll: true,
                    reportDir: 'coverage',
                    reportFiles: 'index.html',
                    reportName: 'RCov Report'
                ]
            }
        }
        stage('reports') {
            steps {
                script {
                    allure([
                            includeProperties: false,
                            properties: [],
                            reportBuildPolicy: 'ALWAYS',
                            results: [[path: './allure-results']]
                    ])
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
            echo env.GIT_COMMIT
            step([$class: 'PhabricatorNotifier', commentOnSuccess: true])
        }
    }
}
