# Frontend
## Dependencies
```
npm i --save react-hook-form react-router-dom axios
```

## Tailwind
```
npm install -D tailwindcss postcss autoprefixer fluid-tailwind
npx tailwindcss init -p
```

### tailwind.config.js
```js
import fluid, { extract, screens, fontSize } from 'fluid-tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: {
    files: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    extract
  },
  theme: {
    extend: {
    },
    screens,
    fontSize,
  },
  plugins: [
    fluid
  ],
}
```

### tsconfig.app.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### tsconfig.node.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

### index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## MUI Components
```
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @fontsource/roboto
```

### main.tsx
```ts
import '@fontsource/roboto';
```

# Backend

## Dependencies
```
npm i --save bcrypt cookie-parser cors express express-validator jsonwebtoken mongoose passport passport-jwt @types/bcrypt @types/cookie-parser @types/cors @types/express @types/express-validator @types/jsonwebtoken @types/mongoose @types/passport @types/passport-jwt dotenv express-rate-limit mongodb
```
## Dev dependencies
```
npm i -D nodemon prettier ts-node typescript tsconfig-paths typescript-eslint eslint-config-prettier eslint-plugin-prettier
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2020",
    "sourceMap": true,
    "outDir": "dist"
  },
  "include": ["src/**/*", "tests/**/*"]
}
```