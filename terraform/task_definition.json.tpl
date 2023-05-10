{
    "containerDefinitions": [
        {
            "name": "rbh-app",
            "image": "${CONTAINER_IMAGE}",
            "cpu": 0,
            "portMappings": [
                {
                    "name": "rbh-app-3000-tcp",
                    "containerPort": 3000,
                    "hostPort": 3000,
                    "protocol": "tcp",
                    "appProtocol": "http"
                }
            ],
            "essential": true,
            "environment": [
                {
                    "name": "GOOGLE_CLIENT_SECRET",
                    "value": "${GOOGLE_SECRET}"
                },
                {
                    "name": "DATABASE_URL",
                    "value": "${DATABASE_URL}"
                },
                {
                    "name": "NEXTAUTH_SECRET",
                    "value": "${SECRET}"
                },
                {
                    "name": "COGNITO_USER_POOL",
                    "value": "${COGNITO_POOL_ID}"
                },
                {
                    "name": "GOOGLE_CLIENT_ID",
                    "value": "${GOOGLE_ID}"
                },
                {
                    "name": "NEXTAUTH_URL",
                    "value": "${URL}"
                },
                {
                    "name": "S3_BUCKET_NAME",
                    "value": "${BUCKET_NAME}"
                },
                {
                    "name": "COGNITO_CLIENT_ID",
                    "value": "${CLIENT_ID}"
                }
            ],
            "mountPoints": [],
            "volumesFrom": []
        }
    ]
}