FROM oven/bun:1 AS deps
WORKDIR /app

COPY package.json bun.lock ./
COPY .husky/install.ts ./.husky/install.ts
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --chown=bun:bun package.json bun.lock ./
COPY --chown=bun:bun .husky/install.ts ./.husky/install.ts
RUN bun install --frozen-lockfile --production

COPY --from=builder --chown=bun:bun /app/.next ./.next
COPY --from=builder --chown=bun:bun /app/public ./public
COPY --from=builder --chown=bun:bun /app/next.config.ts ./next.config.ts

USER bun

EXPOSE 3000

CMD ["bun", "run", "start"]
