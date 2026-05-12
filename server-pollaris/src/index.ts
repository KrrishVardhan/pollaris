// import { createServer } from "node:http"; 
import { createExpressApp } from "./app/index.js";

async function main() {
  try {
    const server = createExpressApp();
    const PORT: number = 8000;
    server.listen(PORT, () => {
      console.log(`HTTP server is running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.log(`Error starting http server: ${error}`);
    throw error;
  }
}

main()