# FROM node:18 AS development

# RUN npm install -g pnpm

# # WORKDIR /app

# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc turbo.json packages apps node_modules ./

# RUN pnpm install
# RUN pnpm build

# COPY  . .

# # EXPOSE 4783

# # CMD ["pnpm", "dev"]

FROM node:18 AS development

RUN npm install -g pnpm

COPY  . .

RUN pnpm install
RUN pnpm build


EXPOSE 4783

CMD ["pnpm", "dev"]