const path = require('path');
require('dotenv').config();

// Forcer le mode library pour Prisma sur Hostinger
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'library';

// Configuration de l'environnement
process.env.NODE_ENV = 'production';
process.env.HOSTNAME = '0.0.0.0';
process.env.PORT = process.env.PORT || 3000;

// Dossier où se trouve le build standalone
const standaloneDir = path.join(__dirname, '.next', 'standalone');

// IMPORTANT : On change le répertoire de travail pour que Next.js 
// trouve les dossiers 'public' et '.next/static' qui sont dedans
process.chdir(standaloneDir);

// On lance le serveur
require(path.join(standaloneDir, 'server.js'));
