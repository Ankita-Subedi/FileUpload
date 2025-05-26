import app from "./app";
import { config } from "./config/env.config";
import "reflect-metadata";
import fs from "fs";
import path from "path";

const processedDir = path.join(__dirname, "../processed");
if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
