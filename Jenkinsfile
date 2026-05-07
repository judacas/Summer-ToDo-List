pipeline {
    agent any

    options {
        // Prevent overlapping deployments on the same Jenkins job.
        disableConcurrentBuilds()
        // Add timestamps to make debugging pipeline logs easier.
        timestamps()
    }

    environment {
        // Compose v2 command (Docker Desktop on Unix/macOS uses "docker compose").
        COMPOSE_CMD = 'docker compose'
        // Health endpoint exposed by the Flask container on host port 5001.
        HEALTH_URL = 'http://flask-app:5000/health'
        // Expected container names from docker-compose.yml.
        FLASK_CONTAINER = 'flask-app'
        MONGO_CONTAINER = 'mongodb'
        // Backend/API environment needed for Docker Compose startup in CI so it doesn't crash
        MONGO_DATABASE = 'summer_bucket_list'
        MONGO_USERNAME = 'admin'
        MONGO_PASSWORD = 'password'
        SECRET_KEY = 'replace-me-with-a-long-random-value'
        GOOGLE_MAPS_API_KEY = 'replace-me'
    }

    stages {
        stage('Cleanup (optional)') {
            steps {
                // Stop/remove any old stack state from previous runs to reduce flaky deploys.
                sh '''
                    set -e
                    $COMPOSE_CMD down --remove-orphans
                '''
            }
        }

        stage('Checkout') {
            steps {
                // Pull the latest commit from the GitHub repository configured in this job.
                checkout scm
            }
        }

        stage('Build') {
            steps {
                // Build all services defined in docker-compose.yml.
                sh '''
                    set -e
                    $COMPOSE_CMD build
                '''
            }
        }

        stage('Deploy') {
            steps {
                // Start Flask + MongoDB in detached mode.
                sh '''
                    set -e
                    $COMPOSE_CMD up -d
                '''
            }
        }

        stage('Verify') {
            steps {
                // Validate that containers are running and app health endpoint responds.
                sh '''
                    set -e

                    if ! docker ps --filter "name=$FLASK_CONTAINER" --filter "status=running" --format "{{.Names}}" | grep -qi "$FLASK_CONTAINER"; then
                      echo "ERROR: Flask container \"$FLASK_CONTAINER\" is not running."
                      docker ps -a
                      exit 1
                    fi

                    if ! docker ps --filter "name=$MONGO_CONTAINER" --filter "status=running" --format "{{.Names}}" | grep -qi "$MONGO_CONTAINER"; then
                      echo "ERROR: MongoDB container \"$MONGO_CONTAINER\" is not running."
                      docker ps -a
                      exit 1
                    fi

                    ok=false
                    for i in $(seq 1 12); do
                      if curl -fsS --max-time 5 "$HEALTH_URL" >/dev/null 2>&1; then
                        ok=true
                        break
                      fi
                      echo "Waiting for Flask health endpoint... attempt $i/12"
                      sleep 5
                    done

                    if [ "$ok" != true ]; then
                      echo "ERROR: Flask health check failed for $HEALTH_URL."
                      $COMPOSE_CMD logs "$FLASK_CONTAINER"
                      exit 1
                    fi

                    echo "Verify stage passed: containers are healthy."
                '''
            }
        }
    }

    post {
        always {
            // Always print compose status to help with incident/debugging.
            sh '''
                set -e
                $COMPOSE_CMD ps
            '''
        }
        failure {
            // On failure, show container logs so the student can troubleshoot quickly.
            sh '''
                set -e
                $COMPOSE_CMD logs --tail=200
            '''
        }
    }
}
