import { createServer } from './server.js';
import fs from 'fs';
import https from 'https';

const port = 443;

const server = createServer();

console.log('DeDe MegaDooDoo') //REMOVE THIS

const privateKey = fs.readFileSync(process.env.PATH_TO_KEY, 'utf8');
const certificate = fs.readFileSync(process.env.PATH_TO_CERT, 'utf8');

const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, server);

httpsServer.listen(port, () => {
  console.log(`HTTPS server running on ${port}`);
});
