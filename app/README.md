# Roommate Budget Helper Next App

## How to open the project

1. To begin first install the following dependencies
    - [Docker Desktop](https://www.docker.com/products/docker-desktop/)
    - [VSCode](https://code.visualstudio.com/)
2. Clone the repository using the following command  
   `git clone git@github.com:Roommate-Budget-Helper/budget-helper-webui.git` - Note if you do not have SSH key setup for GitHub, follow this guide before running the above command: [Adding SSH key to GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
3. Open VSCode
4. Make sure you have the following extensions installed:
    - Docker
    - Remote Development
5. Open the command palette (⌘+shift+p or ctrl+shift+p)
6. Type `Remote Containers: Open Folder in Container`
7. Select the option
8. Open the repository you cloned with the file selection window
9. Create a file in the app folder called `.env` with the following values:

```
# Note that not all variables here might be in use for your selected configuration
# When adding additional env variables, the schema in /env/schema.mjs should be updated accordingly

# Prisma
DATABASE_URL=postgresql://postgres:postgres@host.docker.internal

# Next Auth
NEXTAUTH_SECRET=<super-secret-key-here>
NEXTAUTH_URL=http://localhost:3000

# Next Auth Cognito
COGNITO_CLIENT_ID=<cognito-id-here>
COGNITO_USER_POOL=<user-pool-id-here>

# Google Credentials
GOOGLE_CLIENT_ID=<google-client-id-here>
GOOGLE_CLIENT_SECRET=<google-client-secret-here>
```

10. While in the app folder run `npm i`

## Setting up testing

1. Create a file called `cypress.env.json` in the app folder
2. Enter the following values:
   `{ "API_KEY": "<replace-this-with-your-actual-api-key>" }`
3. Go to [MailSlurp](https://www.mailslurp.com/) and create an account
4. After logging in confirm you see a dashboard similar to this:
   ![MailSlurp Dashboard](../docs/mailslurp.png)
5. Copy the API Access key and place it in the `cypress.env.json`  
   You should now be able run the project
6. Run `npx cypress install` in the /app folder to prepare cypress for the first time
7. Setup an X-Server on your host machine and allow connections to localhost:

-   Mac: `brew install --cask Xquartz`
-   Windows: [Xming](https://sourceforge.net/projects/xming/)
-   Linux: Install `xorg-xhost` package if not already on your system  
    ALL: Run `xhost + localhost`

### Note: Cypress must be run outside of the docker dev environment on your host machine. If you have a M1 Mac refer to the following guide: []()

## Commands

`npm run dev` => Runs the development server  
`npm run test` => Runs the jest test suite  
`npm run e2e` => Runs the cypress test suite  
`npm run lint` => Runs the linter  
`npm run build` => Runs the build command  
`npx prisma generate` => Rebuilds the prisma client for accessing the database from typescript  
`npx prisma db push` => Synchronize the database with the prisma schema  
`npx prisma studio` => Opens prisma studio for debugging

## Troubleshooting

If you do not have an SSH key please refer to the following:

-   [Creating a SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

Note: You must have the SSH-Agent running for the docker development container to recognize your SSH key.
