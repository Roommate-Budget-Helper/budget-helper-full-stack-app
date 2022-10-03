# Roommate Budget Helper Next App

## How to open the project

1. To begin first install the following dependencies
    - [Docker Desktop](https://www.docker.com/products/docker-desktop/)
    - [VSCode](https://code.visualstudio.com/)
2. Clone the repository using the following command  
   `git clone git@github.com:Roommate-Budget-Helper/budget-helper-backend.git` - Note if you do not have SSH key setup for GitHub, follow this guide before running the above command: [Adding SSH key to GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
3. Open VSCode
4. Make sure you have the following extensions installed:
    - Docker
    - Remote Development
5. Open the command palette (⌘+shift+p or ctrl+shift+p)
6. Type `Remote Containers: Open Folder in Container`
7. Select the option
8. Open the repository you cloned with the file selection window

You should now be able run the project

## Commands

`npm run dev` => Runs the development server  
`npm run test` => Runs the test suite  
`npm run lint` => Runs the linter
`npm run build` => Runs the build command

## Troubleshooting

If you do not have an SSH key please refer to the following:

-   [Creating a SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

Note: You must have the SSH-Agent running for the docker development container to recognize your SSH key.
