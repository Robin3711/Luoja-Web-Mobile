const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

// Chemins vers vos certificats SSL (Let's Encrypt)
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/luoja.fr/privkey.pem', 'utf8'),
  cert: fs.readFileSync('/etc/letsencrypt/live/luoja.fr/fullchain.pem', 'utf8'),
};

const app = express();
const PORT = 4000;

// Servir les fichiers statiques à partir du dossier `dist`
app.use(express.static(path.resolve(__dirname, 'dist')));

// Route pour renvoyer `index.html` pour toutes les autres requêtes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// Créer un serveur HTTPS sur le port 4000
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🚀 Serveur HTTPS lancé sur https://localhost:${PORT}`);
});
