// import { createServer } from "node:http";
import "dotenv/config";
import { createExpressApp } from "./app/index.js";

async function main() {
  try {
    const server = createExpressApp();
    const PORT = Number(process.env.PORT) || 3000;
    server.listen(PORT,"0.0.0.0", () => {
      console.log(`HTTP server is running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.log(`Error starting http server: ${error}`);
    throw error;
  }
}

main();
