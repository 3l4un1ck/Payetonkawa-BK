pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo '=== Starting Checkout ==='
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                        userRemoteConfigs: [[
                        url: 'https://github.com/3l4un1ck/integration-continue.git',
                        credentialsId: 'github-creds'
                    ]]
               ])
               echo '=== Finished Checkout ==='
           }
        }
        stage('Run Auth Service') {
            steps {
                echo '=== Starting Auth Service ==='
                sh 'chmod +x ./execute.sh'
//                 sh './execute.sh auth-service'
            }
        }
    }
}