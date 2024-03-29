# Deployment Guide

This guide will walk through the setup of deploying the application to AWS using terraform.

## Prerequisites

- A working AWS Root Account
- Terraform installed on your system, recommend using [tfenv](https://github.com/tfutils/tfenv)
- Familiarity with AWS Console

## Stage 1 - Setup AWS Terraform User

1. Login to AWS
   ![aws console](./resources/aws-console.png)
2. Ensure us-east-1 is selected for the region
   ![aws-region](./resources/aws-region.png)
3. Navigate to IAM and select the IAM service
   ![Search IAM](./resources/aws-iam-search.png)
4. Select `Users` from the menu on the left of the IAM dashboard
   ![User IAM](./resources/aws-iam-user.png)
5. Press `Add user` button
   ![Add User](./resources/aws-add-user.png)
6. Make the username `Terraform` and click next
   ![Set Username](./resources/aws-specify-username.png)
7. Select `Attach policies directly` and select the `AdministratorAccess` AWS managed policy, then press next
   ![Policies](./resources/aws-policies.png)
8. Confirm the user creation on the next screen
9. Click on the newly created user and navigate to `Security Credentials`, scroll down and click on `Create access key`
   ![Create access](./resources/aws-create-access-key.png)
10. Select `Command Line Interface (CLI)` and accept the above recommendation, then press `Next`
    ![AWS configure key](./resources/aws-configure-key.png)
11. Press `Create access key`
12. On The next screen, it will provide you the credentials. Store them safely and press `Done`

Your AWS account should now be configured correctly for terraform.

## Stage 2 - Terraform setup

1. On the cloned repository open a terminal
2. navigate to the `terraform` directory
3. Run ` terraform init`
4. Run `aws configure`
5. Enter the access key of your Terraform user created in stage 1
6. Enter the secret key for the terraform user
7. Setup the default region as `us-east-1`
8. Leave the output format as default

### Google Auth Setup

Before continuing with Terraform, you must create google oauth credentials.

1. Navigate to `https://console.cloud.google.com/`
2. Login with the Google account you plan on using to manage the project
3. Create a new project
   ![google new project](./resources/google-new-project.png)
4. Enter a project name and press next
   ![Create project](./resources/google-create-project.png)
5. Once the project is created and is the actively selected project. Navigate to `APIs & Services`
   ![Google APIs](./resources/google-apis.png)

6. From the left sidemenu select credentials
   ![Google credentials](./resources/google-creds.png)
7. Click `Configure Consent Screen`
8. Select `External` and press create
9. Fill in the information with App name, user email, app logo, and domain
10. Click continue
11. Under scopes, select userinfo.email, userinfo.profile, and openid
12. Press continue and continue
13. Press return to dashboard
14. Return to credentials
15. Click create credentials
16. Select `OAuth Client ID`
17. Select `Web Application`
18. Name it `RBH Web`

19. Add the following javascript origins

- `https://<your-domain-here>`
- `http://localhost:3000` for local development

20. Add the following redirect URIs:

- `https://<your-domain-here>/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/google` for local development

21. Press create, it will provide you the client id and client secret, store them somewhere safe and feel free to download the JSON file.

### Terraform Continued

9. In the terraform folder in your terminal, run `terraform plan`
10. Enter the google id and secret
11. Verify terraform creates a valid plan
12. run `terraform apply` to provision the infrastructure
13. Type `yes` to approve the creation
14. Log back into AWS after the infrastructure is created
15. Navigate to EC2
16. Create a new elastic IP
17. Attach it to the running ec2 instance

### Push App image

1. Navigate to app folder of the repository in your terminal
2. Log into AWS and navigate to ECR
3. Click on "rbh-app" under private repositories
4. Click view push commands
5. Run each of the push commands

### Extra steps

1. Configure your domain to point to a nginx reverse proxy (host yourself)
2. Setup SSL on Nginx reverse proxy
3. Reverse proxy should redirect http, https of your domain to the elastic ip of your instance in AWS targetting port 3000

Example nginx config

```
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

server{
    server_name roommatebudgethelper.tk;
    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    	proxy_buffering off;
	proxy_buffer_size 16k;
	proxy_busy_buffers_size 25k;
	proxy_buffers 64 4k;
	}

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/roommatebudgethelper.tk/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/roommatebudgethelper.tk/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}



server{
    if ($host = roommatebudgethelper.tk) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name roommatebudgethelper.tk;
    return 404; # managed by Certbot


}}
```

## Integrate with Github Actions

1. Set the following secrets in Github Actions on the repository

```
AWS_ACCESS_KEY_ID = <access key of terraform user>
AWS_SECRET_ACCESS_KEY = <secret key of terraform user>
COGNITO_CLIENT_ID = <from terraform output>
COGNITO_USER_POOL = <from terraform output>
CYPRESS_API_KEY = <from mailslurp - Read Dev Guide 'Setting up testing'>
DATABASE_URL = <from terraform output>
GOOGLE_CLIENT_ID = <from google setup>
GOOGLE_CLIENT_SECRET = <from google setup>yum install certbot python3-certbot-nginx
NEXTAUTH_SECRET = <from terraform output>
NEXTAUTH_URL = <base url of domain e.x https://roommatebudgethelper.tk>
S3_BUCKET_NAME = <from terraform output>
SLACK_TOKEN = <see make slack token>
URL = <base url of domain e.x https://roommatebudgethelper.tk>
```

### Useful commands

`terraform output <name of output>` - Provides the value of terraform output field, will show sensitive information
