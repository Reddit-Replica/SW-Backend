pipeline {
  agent any
  triggers {
    githubPush()
  }

  	environment {
		DOCKERHUB_CREDENTIALS=credentials('Dockerhub')
	}

  stages{
    
    stage("unit test"){
      agent {
        docker {
            image 'node:lts'
            reuseNode true
        }
    }

    steps {
              sh "npm i "
              sh"""
              cp /Read-it/deployment/envfiles/backend_testing.env ./.env
              cp /Read-it/Backend/private/privateKey.json ./private/
              """
              sh "npm run test"
      }
  }

  stage('Build') {

    steps {
      sh 'docker build -t waer/backend:latest .'
    }
  }

  stage("intgration testing"){
    steps {
          sh """
            cd /Read-it-testing/deployment-testing
            docker-compose up --exit-code-from cypress
            docker wait cypress
           """
      }
  }

		stage('Login') {

			steps {
				sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
			}
		}


    stage('Push') {
			steps {
				sh 'docker push waer/backend:latest'
			}
		}

}

	post {
		always {
			sh 'docker logout'
      echo "------------------------------ down the Testing enviroment ---------------------------------------------"
      sh"""
        cd /Read-it-testing/deployment-testing
        docker-compose down
      """
		}
	}

}