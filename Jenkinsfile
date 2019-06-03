pipeline {
    agent {
        kubernetes {
            label 'node-carbon'
        }
    }
    environment {
        REPOSITORY = 'molgenis/molgenis-frontend'
        LOCAL_REPOSITORY = "${LOCAL_REGISTRY}/molgenis/molgenis-frontend"
    }
    stages {
        stage('Prepare') {
            steps {
                script {
                    env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                }
                container('vault') {
                    script {
                        env.GITHUB_TOKEN = sh(script: 'vault read -field=value secret/ops/token/github', returnStdout: true)
                        env.CODECOV_TOKEN = sh(script: 'vault read -field=molgenis-frontend secret/ops/token/codecov', returnStdout: true)
                        env.NEXUS_AUTH = sh(script: 'vault read -field=base64 secret/ops/account/nexus', returnStdout: true)
                        sh "set +x; echo '_auth=${NEXUS_AUTH}' > ~/.npmrc"
                    }
                }
                sh "git remote set-url origin https://${GITHUB_TOKEN}@github.com/${REPOSITORY}.git"
                sh "git fetch --tags"
            }
        }
        stage('Install and test: [ pull request ]') {
            when {
                changeRequest()
            }
            steps {
                container('node') {
                    sh "yarn install"
                    sh "yarn lerna bootstrap"
                    sh "yarn lerna run unit"
                    sh "yarn lerna run build"
                }
            }
            post {
                always {
                    container('node') {
                        sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K -C ${GIT_COMMIT}"
                    }
                }
            }
        }
        stage('Push to registries [ PR ]') {
            when {
                changeRequest()
            }
            environment {
                TAG = "PR-${CHANGE_ID}-${BUILD_NUMBER}"
                DOCKER_CONFIG="/root/.docker"
            }
            steps {
                container (name: 'kaniko', shell: '/busybox/sh') {
                    sh "#!/busybox/sh\nmkdir -p /root/.docker/"
                    sh "#!/busybox/sh\necho '{\"auths\": {\"registry.molgenis.org\": {\"auth\": \"${NEXUS_AUTH}\"}}}' > /root/.docker/config.json"
                    sh "#!/busybox/sh\nrm -rf docker/dist&&mkdir docker/dist&&cp -rf packages/*/dist/* docker/dist"
                    sh "#!/busybox/sh\nrm -rf docker/dist/index.htm*"
                    sh "#!/busybox/sh\n/kaniko/executor --context ${WORKSPACE}/docker --destination ${LOCAL_REPOSITORY}:${TAG}"
                }
            }
        }
        stage('Deploy preview [ PR ]') {
            when {
                changeRequest()
            }
            environment {
                TAG = "PR-${CHANGE_ID}-${BUILD_NUMBER}"
                NAME = "preview-frontend-${TAG.toLowerCase()}"
            }
            steps {
                container('vault') {
                    sh "mkdir /home/jenkins/.rancher"
                    sh 'vault read -field=value secret/ops/jenkins/rancher/cli2.json > /home/jenkins/.rancher/cli2.json'
                }
                container('rancher') {
                    sh "rancher context switch dev-molgenis"
                    sh "rancher apps install " +
                        "molgenis-frontend " +
                        "${NAME} " +
                        "--no-prompt " +
                        "--set environment=dev " +
                        "--set image.tag=${TAG} " +
                        "--set image.repository=${LOCAL_REGISTRY} " +
                        "--set backend.url=https://latest.test.molgenis.org " +
                        "--set image.pullPolicy=Always"
                }
            }
            post {
                success {
                    hubotSend(message: "PR Preview available on https://${NAME}.dev.molgenis.org", status:'INFO', site: 'slack-pr-app-team')
                    container('node') {
                        sh "set +x; curl -X POST -H 'Content-Type: application/json' -H 'Authorization: token ${GITHUB_TOKEN}' " +
                            "--data '{\"body\":\":star: PR Preview available on https://${NAME}.dev.molgenis.org\"}' " +
                            "https://api.github.com/repos/molgenis/molgenis-frontend/issues/${CHANGE_ID}/comments"
                    }
                }
            }
        }
        stage('Install, test and build: [ master ]') {
            when {
                branch 'master'
            }
            steps {
                container('node') {
                    sh "yarn install"
                    sh "yarn lerna bootstrap"
                    sh "yarn lerna run unit"
                    sh "yarn lerna run build"
                }
            }
            post {
                always {
                    container('node') {
                        sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K -C ${GIT_COMMIT}"
                    }
                }
            }
        }
        stage('Release canary: [ master ]'){
            when {
                branch 'master'
            }
            steps {
                lock("Tags"){
                    sh "git fetch --tags"
                    container('node') {
                        sh "yarn lerna publish --canary"
                    }
                }
            }
        }
        stage('Release: [ master ]') {
            when {
                branch 'master'
                not {
                changelog '.*\\[skip ci\\]$'
                }
            }
            environment {
                GIT_AUTHOR_EMAIL = 'molgenis+ci@gmail.com'
                GIT_AUTHOR_NAME = 'molgenis-jenkins'
                GIT_COMMITTER_EMAIL = 'molgenis+ci@gmail.com'
                GIT_COMMITTER_NAME = 'molgenis-jenkins'
                NPM_CONFIG_EMAIL='molgenis+npm@gmail.com'
                NPM_CONFIG_USERNAME='molgenis-npm'
                // NPM_TOKEN
                // GH_TOKEN 
                // RELEASE_GH_TOKEN
                RELEASE_GH_USERNAME = 'molgenis-jenkins'
            }
            steps {
                container('node') {
                    // This will publish all npm packages, including creating commits and tags for each release,
                    // in the format that lerna expects for the `lerna updated` command.
                    // # Pre: Set up the versions, tags and commits
                    sh "lerna-semantic-release pre" 
                    // # Perform: # Publishes to npm
                    sh "lerna-semantic-release perform"
                    // # Post
                    sh "lerna-semantic-release post"
                    // # Generates a changelog in each package in a file named CHANGELOG.md 
                    //- will not commit or push that file any more after version 7.0.5 any more.
                    // If you want to do something with it, you will need to do this manually.
                }
            }
        }
    }
    post{
        success {
            hubotSend(message: 'Build success', status:'INFO', site: 'slack-pr-app-team')
        }
        failure {
            hubotSend(message: 'Build failed', status:'ERROR', site: 'slack-pr-app-team')
        }
    }
}
