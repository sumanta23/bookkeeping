pipeline {
    agent {
      kubernetes {
      yaml '''
        apiVersion: v1
        kind: Pod
        spec:
          containers:
          - name: docker
            image: docker:latest
            command:
            - cat
            tty: true
            volumeMounts:
             - mountPath: /var/run/docker.sock
               name: docker-sock
          - name: mongo
            image: mongo:latest
          - name: node
            image: node:8-alpine
          volumes:
          - name: docker-sock
            hostPath:
              path: /var/run/docker.sock
        '''
      }
    }
    stages {
        stage('Test') {
            steps {
                script {
                  container('node') {
                            sh 'npm install'
                            sh 'cat /etc/hosts'
                            sh 'MONGODB_HOST=db npm test'
                            sh 'MONGODB_HOST=db npm run coverage'
                            sh 'MONGODB_HOST=db npm run allure'
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
            step([$class: 'PhabricatorNotifier', commentOnSuccess: true, commitId: env.GIT_COMMIT])
        }
    }
}
