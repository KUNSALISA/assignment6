// pipeline {
//     agent any

//     environment {
//         FIREBASE_PROJECT = 'assignment-6-unging2jeng'
//     }


//     stages {
//         stage('Clone') {
//             steps {
//                 git url: 'https://github.com/cpe-nuntawut/assignment-6-unging2jeng.git', branch: 'main'

//             }
//         }

//         stage('Build') {
//             steps {
//                 dir('assignment-6-unging2jeng') {
//                      sh 'docker compose up --build -d'
//                      sh 'docker compose up --build jenkins'

//                 }
//             }
//         }

//         stage('Install Firebase CLI') {
//             steps {
//                 dir('assignment-6-unging2jeng') {
//                     sh 'npm install firebase-tools'
//                 }
//             }
//         }

//         stage('Deploy') {
//             steps {
//                 withCredentials([string(credentialsId: 'FIREBASE_TOKEN', variable: 'FIREBASE_TOKEN')]) {
//                     dir('assignment-6-unging2jeng') {
//                         sh 'npx firebase deploy --only hosting:$FIREBASE_PROJECT --token $FIREBASE_TOKEN'
//                     }
//                 }
//             }
//         }
//     }

//     post {
//         success {
//             echo 'Deployment succeeded.'
//         }
//         failure {
//             echo 'Deployment failed.'
//         }
//     }
// }

pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/KUNSALISA/assignment6.git'
            }
        }

        stage('Stop Old Containers ') {
            steps {
                sh 'docker-compose -f ${COMPOSE_FILE} down || true'
            }
        }

        stage('Build & Start Containers') {
            steps {
                sh 'docker-compose -f ${COMPOSE_FILE} build'
                sh 'docker-compose -f ${COMPOSE_FILE} up -d'
            }
        }
    }
}