FROM oven/bun:1

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 5432
CMD ["bun", "run", "src/index.ts"]