import { app } from "./app.js";
import { isMongoConfigured } from "./db/mongo.js";
import { currentProviderName } from "./providers/index.js";

const PORT = Number(process.env.PORT) || 8787;

app.listen(PORT, () => {
  console.log(`Yo'ldosh AI server: http://localhost:${PORT}`);
  console.log(`  AI provayder: ${currentProviderName()}`);
  console.log(`  MongoDB: ${isMongoConfigured() ? "sozlangan" : "sozlanmagan (localStorage-only)"}`);
});
