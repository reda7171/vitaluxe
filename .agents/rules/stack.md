---
trigger: always_on
---

📘 Cahier des Charges – Vitaluxe
🏥 Site E-commerce Parapharmacie
🚀 Stack : Next.js
1️⃣ Stack Technologique
🎨 Frontend & Backend (Fullstack JS)
🟢 Framework principal

Next.js 14+ (App Router)

React 18

TypeScript (obligatoire pour projet pro)

🎨 UI & Styling

TailwindCSS (pour reproduire le style #103178)

ShadCN UI ou Headless UI

Framer Motion (animations)

🗄 Base de données

MySql

🔄 ORM

Prisma ORM

🔐 Authentification

NextAuth.js

JWT

Auth via Google / Email / OTP

💳 Paiement

Stripe

PayPal

Paiement à la livraison (COD)

2️⃣ Architecture du projet
/app
  /(public)
    /page.tsx
    /shop
    /product/[slug]
  /(auth)
  /(dashboard)
    /admin
/components
/lib
/prisma
3️⃣ Avantages de Next.js pour Vitaluxe

✅ SEO natif (important pour Google)
✅ Server Side Rendering (SSR)
✅ Static Generation (SSG)
✅ Performance optimisée
✅ API Routes intégrées
✅ Facilement scalable

4️⃣ Architecture Base de Données (exemple)
User

id

name

email

password

role (ADMIN / CUSTOMER)

createdAt

Product

id

name

slug

description

price

salePrice

stock

images[]

categoryId

brand

createdAt

Category

id

name

slug

image

Order

id

userId

totalAmount

status

paymentMethod

createdAt

OrderItem

id

orderId

productId

quantity

price

5️⃣ Fonctionnalités principales
🏠 Page d’accueil

Hero section (style screenshot)

Produits en promo

Meilleures ventes

Avis clients

Newsletter

🛍 Boutique

Filtres dynamiques (prix, marque, catégorie)

Pagination

Recherche intelligente

📦 Fiche produit

Galerie images

Prix barré

Stock dynamique

Avis clients

Produits similaires

🛒 Panier

Stock en temps réel

Code promo

Calcul automatique livraison

👤 Espace client

Historique commandes

Suivi commande

Adresse sauvegardée

🔧 Dashboard Admin

CRUD produits

Gestion commandes

Statistiques ventes

Gestion stock

6️⃣ SEO & Performance

Metadata dynamique

OpenGraph

Sitemap.xml

Robots.txt

Lazy loading images

Optimisation Lighthouse > 90

