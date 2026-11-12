import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

async function start() {
  await connectDatabase();
  app.listen(env.PORT, () => console.log(`API listening on port ${env.PORT}`));
}

start().catch((error) => {
  console.error("Application failed to start", error);
  process.exit(1);
});
