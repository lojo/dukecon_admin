#!/usr/bin/env groovy
@Library('jenkins-library@master') _

pipeline {
  agent {
    node {
      label 'docker'
    }
  }

  triggers {
    pollSCM('* * * * *')
  }

  stages {
    stage('Build') {
      when {
        branch 'master'
      }
      steps {
        withMaven {
          sh 'mvn clean package docker:build -Pjavaland -Pdocker-build docker:build docker:push'
          build job: 'docker_restart_develop_latest'
        }
      }
    }
  }
  post {
    always {
      sendNotification currentBuild.result
    }
    failure {
      // notify users when the Pipeline fails
      mail to: 'gerd@aschemann.net',
        subject: "Failed Admin Client Pipeline: ${currentBuild.fullDisplayName}",
        body: "Something is wrong with ${env.BUILD_URL}"
    }
  }
}
