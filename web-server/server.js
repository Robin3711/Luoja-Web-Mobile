const express = require('express');
const path = require('path');

const app = express();
const PORT = 4000;

// Vérifiez que le dossier est bien servi
app.use(express.static(path.resolve(__dirname, 'dist')));

// Route pour renvoyer `index.html` pour toutes les autres requêtes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});