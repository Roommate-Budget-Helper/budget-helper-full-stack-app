FROM --platform=linux/amd64  node:18-alpine as dependencies

WORKDIR /app
COPY package.json ./
RUN CYPRESS_INSTALL_BINARY=0  npm i

FROM --platform=linux/amd64  node:18-alpine as build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
##### SET DEFAULT ENV
ENV DATABASE_URL=database://user:pass@host

# Next Auth
ENV NEXTAUTH_SECRET=secret
ENV NEXTAUTH_URL=http://url

# Next Auth Cognito
ENV COGNITO_CLIENT_ID=id
ENV COGNITO_USER_POOL=pool

# Google Credentials
ENV GOOGLE_CLIENT_ID=id
ENV GOOGLE_CLIENT_SECRET=secret

ENV S3_BUCKET_NAME=bucket

RUN npm run build

FROM --platform=linux/amd64 node:18-alpine as deploy

WORKDIR /app

ENV NODE_ENV production
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]