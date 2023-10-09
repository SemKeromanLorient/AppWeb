const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Importez le middleware cors

const app = express();
const port = 3001;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/images/');
  },
  filename: function (req, file, cb) {
    cb(null, "imageCriee.jpg");
  },
});

const upload = multer({ storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Configurez CORS pour autoriser les requêtes depuis http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // Certaines versions de cors nécessitent cela pour fonctionner avec les navigateurs modernes
}));

app.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).send('Fichier téléchargé avec succès !');
});

app.listen(port, () => {
  console.log(`Serveur écoutant sur le port ${port}`);
});
