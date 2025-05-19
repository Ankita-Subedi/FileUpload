import app from "./app";
import { config } from "./config/env.config";
import "reflect-metadata";

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
