pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo '=== Starting Checkout ==='
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/master']],
                        userRemoteConfigs: [[
                        url: 'https://github.com/3l4un1ck/Payetonkawa-BK.git',
                        credentialsId: 'github-creds'
                    ]]
               ])
               echo '=== Finished Checkout ==='
           }
        }

        stage('Restart Auth Service Clean') {
            steps {
                echo '=== Stopping and Removing Old Containers ==='
                sh 'docker-compose down'
                echo '=== Cleaning Up Docker Resources ==='
                sh 'docker system prune -f'
                echo '=== Starting Fresh Auth Service ==='
                sh 'docker-compose up -d --build'
                echo '=== Auth Service Restarted ==='
            }
        }

        stage('Run Auth Service') {
            steps {
                echo '=== Starting Auth Service ==='
                sh 'docker-compose up -d --build'
                echo '=== Auth Service Started ==='
            }
        }
    }


//     post {
//         always {
//             mail to: 'elaurichenickson@gmail.com',
//                  subject: "Build Notification: ${currentBuild.fullDisplayName}",
//                  body: """
//                  Hello,
//
//
//                  The pipeline '${env.JOB_NAME}' has completed.
//                  Build Number: ${env.BUILD_NUMBER}
//                  Status: ${currentBuild.currentResult}
//
//                  You can view the build details at: ${env.BUILD_URL}
//
//                  Regards,
//                  Jenkins
//                  """
//         }
//     }
}