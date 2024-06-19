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
            command:
            - cat
            tty: true
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
                            sh 'npm test'
                            sh 'npm run coverage'
                            sh 'npm run allure'
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
    }
    post {
        always {
            junit '**/jenkins-test-results.xml'
            echo env.GIT_COMMIT
        }
    }
}
