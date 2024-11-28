# Paruoštukas
## Pradžia
Šis projektas yra full stack aplikacija sukurta naudojant ReactJS ir ExpressJS, rašyti su TypeScript.

## Turinys
- [Naudojamos technologijos](#naudojamos-technologijos)
- [Reikalavimai](#reikalavimai)
- [Instaliacija](#instaliacija)
- [Naudojimasis](#naudojimasis)
- [API Dokumentacija](#api-dokumentacija)

## Naudojamos technologijos
- **Frontent:** ReactJS (v18 | TS), TailwindCSS (v3),
- **Backend:** NodeJS, ExpressJS (TS),
- **Database:** MongoDB,
- **Authentication:** JWT-Based

## Reikalavimai
Įsitikinkite, kad turite:
- **NodeJS** (v16 ar naujesnę)

## Instaliacija
### Klonuok repozirotija
```bash
git clone https://github.com/4Zade/Paruostukas.git
cd Paruostukas
```

### Frontend paleidimas
```bash
cd frontend
npm i
npm run dev
```

### Backend paleidimas
```bash
cd backend
npm i
npm run dev
```

### Env failas
```env
MONGO_URI=your_mongo_uri

JWT_ACCESS_SECRET=your_jwt-secret

PORT=7000
```

## Naudojimasis
### Prieiga prie paleisto puslapio:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:7000


## API Dokumentacija
### Autentifikacija:

- `POST /api/auth/register` - Priregistruoti vartotoją.
- `POST /api/auth/login` - Prijungti vartotoją.

### Produktai:

- `GET /api/products` - Gauti visus produktus.
- `POST /api/products` - Sukurti produktą.
- `GET /api/products/:id` - Gauti vieną produktą pagal produkto ID.
- `PUT /api/products/:id` - Redaguoti vieną produktą pagal jo ID.
- `DELETE /api/products/:id` - Ištrinti vieną produktą pagal jo ID.
- `POST /api/products/:id/favorite` - Pridėti produktą į megstamiausius.

### Krepšelis:

- `GET /api/cart` - Gauti savo krpešelį.
- `DELETE /api/cart` - Išvalyti savo krepšelį.
- `POST /api/cart/:id` - Pridėti produktą į savo krepšelį.
- `DELETE /api/cart/:id` - Pašalinti 1 produktą iš savo krepšelio.
- `DELETE /api/cart/:id/all` - Ištrinti 1 produktą iš krepšelio.

### Transakcijos:

- `GET /api/transactions` - Gauti visas transakcijas.
- `POST /api/transactions` - Sukurti transakcija (pirkti).
- `GET /api/transactions/:id` - Gauti vieną transakcija.