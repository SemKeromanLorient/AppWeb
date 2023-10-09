// Programme permettant de télécharger un fichier excel pour remplacer l'ancien. Ce fichier sera alors traiter pour en tirer l'ordre pour la vente à la criée

const fetch = require('node-fetch');
const fs = require('fs');
const XLSX = require('xlsx');
const cron = require('node-cron');
// Fonction pour télécharger le fichier Excel et le convertir en JSON
// Fonction pour télécharger le fichier Excel et le convertir en JSON
const downloadAndProcessExcel = async () => {
  try {
    
    const excelUrl =  'https://criee.keroman.fr/lor/data/data_cotiere_acheteur.xls';

    // Télécharge le fichier Excel
    const response = await fetch(excelUrl);
    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement du fichier Excel');
    }

    const excelData = await response.arrayBuffer();

    // Convertit le fichier Excel en tableau JSON
    const workbook = XLSX.read(excelData, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Traitez les données comme vous le souhaitez
    console.log(jsonData);

    // Enregistrez les données dans un fichier JSON si nécessaire
    fs.writeFileSync('excel_data.json', JSON.stringify(jsonData, null, 2));
  } catch (error) {
    console.error('Une erreur est survenue :', error);
  }
};

// Planifier l'exécution tout les jours à 21 heures
cron.schedule('10 */9 * * *', () => {
  console.log('Exécution toutes les 21 heures');
  downloadAndProcessExcel();
});
