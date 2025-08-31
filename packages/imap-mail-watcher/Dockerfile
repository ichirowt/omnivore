FROM node:22.12 as builder

WORKDIR /app

RUN apt-get update && apt-get install -y g++ make python3

# Copy root files
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY .prettierrc .
COPY .eslintrc .

# Copy workspace package manifests and sources BEFORE running yarn install so workspace deps are resolvable
COPY /packages/imap-mail-watcher/package.json ./packages/imap-mail-watcher/package.json
COPY /packages/imap-mail-watcher/tsconfig.json ./packages/imap-mail-watcher/tsconfig.json
COPY /packages/imap-mail-watcher/src ./packages/imap-mail-watcher/src
COPY /packages/utils/package.json ./packages/utils/package.json
COPY /packages/utils ./packages/utils

# Install dependencies (will hoist workspace deps into /app/node_modules)
RUN yarn install --pure-lockfile --network-timeout=300000

# Ensure Node type definitions are available for tsc
RUN yarn add -D -W @types/node@latest --exact

# Build workspaces
RUN yarn workspace @omnivore/utils build
RUN yarn workspace @omnivore/imap-mail-watcher build

FROM node:22.12 as runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/packages/imap-mail-watcher/dist /app/packages/imap-mail-watcher/dist
COPY --from=builder /app/packages/imap-mail-watcher/package.json /app/packages/imap-mail-watcher/package.json
COPY --from=builder /app/packages/imap-mail-watcher/node_modules /app/packages/imap-mail-watcher/node_modules
COPY --from=builder /app/packages/utils/ /app/packages/utils/


COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

CMD ["yarn", "workspace", "@omnivore/imap-mail-watcher", "start"]
