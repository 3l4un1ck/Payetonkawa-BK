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
        stage('Run Auth Service') {
            steps {
                echo '=== Starting Auth Service ==='
                sh 'docker-compose up -d --build'
                echo '=== Auth Service Started ==='
            }
        }
    }
}