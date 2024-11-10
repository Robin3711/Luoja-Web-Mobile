const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = 4000;
const PROTOCOL = process.env.PROTOCOL || 'HTTP'; // 'http' par défaut
const DOMAIN = process.env.DOMAIN || 'localhost'; // 'localhost' par défaut

// Servir les fichiers statiques à partir du dossier `dist`
app.use(express.static(path.resolve(__dirname, 'dist')));

// Route pour renvoyer `index.html` pour toutes les autres requêtes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

if (PROTOCOL === 'HTTPS') {
  // Configuration du serveur HTTPS
  const sslOptions = {
    key: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/privkey.pem`, 'utf8'),
    cert: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/fullchain.pem`, 'utf8'),
  };

  // Créer un serveur HTTPS
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`🚀 Serveur HTTPS lancé sur https://${DOMAIN}:${PORT}`);
  });
} else {
  // Créer un serveur HTTP
  app.listen(PORT, () => {
    console.log(`🚀 Serveur HTTP lancé sur http://${DOMAIN}:${PORT}`);
  });
}
