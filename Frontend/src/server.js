const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const dotenv = require('dotenv');

// Explicitly specify the path to the .env file
const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
    throw result.error;
}

const app = express();
const PORT = 3000;

// Print current working directory
console.log('Current working directory:', process.cwd());

// Read your SSL certificate and key files
const privateKeyPath = path.resolve(__dirname, process.env.SSL_KEY_FILE);
const certificatePath = path.resolve(__dirname, process.env.SSL_CRT_FILE);

console.log('SSL_KEY_FILE:', privateKeyPath);
console.log('SSL_CRT_FILE:', certificatePath);

try {
    fs.accessSync(privateKeyPath, fs.constants.R_OK);
    fs.accessSync(certificatePath, fs.constants.R_OK);
} catch (err) {
    console.error(`File access error: ${err.message}`);
    throw new Error(`File access error: ${err.message}`);
}

if (!fs.existsSync(privateKeyPath)) {
    throw new Error(`Private key file does not exist at path: ${privateKeyPath}`);
}

if (!fs.existsSync(certificatePath)) {
    throw new Error(`Certificate file does not exist at path: ${certificatePath}`);
}

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');

// Create HTTPS server
const server = https.createServer({ key: privateKey, cert: certificate }, app);

// Serve static files
app.use(express.static(path.join(__dirname, 'build'))); // adjust if your build folder is named differently

// Define your routes here, if any
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on https://codemetrics.info:${PORT}`);
});