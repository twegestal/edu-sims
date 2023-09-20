import { createServer } from "./server.js";
const port = 3000;

const server = createServer();

server.listen(port, () => {
  console.log(`Server running at ${port}`);
});
