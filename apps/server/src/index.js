import { createServer } from './server.js';
import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config();
const port = 443;

const server = createServer();

const privateKey = fs.readFileSync('C:/Users/vikto/Documents/GitHub/edu-sims/apps/server/certificates/key.pem', 'utf8');
const certificate = fs.readFileSync('C:/Users/vikto/Documents/GitHub/edu-sims/apps/server/certificates/cert.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, server);


httpsServer.listen(port, () => {
  console.log(`HTTPS server running on ${port}`);
});
