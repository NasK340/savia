# Livia - Application Shopify SAV Automatisé

## 🎯 Validation Shopify Partners

Cette application respecte **toutes les exigences** des validations automatiques Shopify :

### ✅ Exigences Respectées

1. **Authentification après installation immédiate** ✓
2. **Redirection vers l'UI de l'app immédiatement après OAuth** ✓
3. **Utilisation du dernier script App Bridge chargé depuis le CDN Shopify** ✓
4. **Usage de jetons de visite (session tokens) pour l'authentification** ✓
5. **Fourniture des webhooks GDPR obligatoires** ✓
6. **Vérification HMAC des webhooks** ✓
7. **Initialisation de la table GDPR en base** ✓
8. **Certificat TLS valide** ✓

## 🏗️ Architecture

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthCallback.tsx     # Gestion OAuth Shopify
│   │   └── AuthGuard.tsx        # Protection des routes
│   ├── shopify/
│   │   └── ShopifyApp.tsx       # App principale Shopify
│   └── layout/
│       ├── Sidebar.tsx          # Navigation
│       └── Header.tsx           # En-tête avec infos boutique
├── hooks/
│   └── useShopify.ts            # Hook principal Shopify
├── lib/
│   └── app-bridge.ts            # Singleton App Bridge
└── contexts/
    └── ShopifyContext.tsx       # Contexte Shopify

supabase/functions/
├── shopify-oauth/               # Échange code OAuth
├── shopify-gdpr/                # Webhooks GDPR
└── shopify-setup/               # Initialisation tables
```

## 🚀 Installation

### 1. Configuration Shopify

1. Créez une app dans le Partner Dashboard
2. Configurez les URLs :
   - **App URL** : `https://your-domain.com/app`
   - **Allowed redirection URLs** : `https://your-domain.com/auth`

### 2. Variables d'environnement

Copiez `.env.example` vers `.env` et configurez :

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Shopify
VITE_SHOPIFY_API_KEY=your_api_key
SHOPIFY_CLIENT_SECRET=your_client_secret
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
```

### 3. Déploiement

```bash
# Installer les dépendances
npm install

# Déployer les Edge Functions
supabase functions deploy shopify-oauth
supabase functions deploy shopify-gdpr
supabase functions deploy shopify-setup

# Build et déployer l'app
npm run build
```

## 🔧 Tests de Validation

### Test 1 : Installation OAuth
```bash
# URL d'installation
https://your-shop.myshopify.com/admin/oauth/authorize?client_id=YOUR_API_KEY&scope=read_orders,write_orders&redirect_uri=https://your-domain.com/auth
```

### Test 2 : App Bridge
```javascript
// Vérifier dans la console du navigateur
console.log(window.ShopifyAppBridge) // Doit être défini
```

### Test 3 : Session Tokens
```bash
# Vérifier les headers des requêtes
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### Test 4 : Webhooks GDPR
```bash
# Vérifier dans Shopify Admin > Settings > Notifications
# Doit afficher 3 webhooks :
# - customers/data_request
# - customers/redact  
# - shop/redact
```

### Test 5 : HMAC Validation
```bash
# Tester avec un webhook factice
curl -X POST https://your-domain.com/functions/v1/shopify-gdpr \
  -H "X-Shopify-Hmac-Sha256: VALID_HMAC" \
  -H "X-Shopify-Topic: customers/data_request" \
  -H "X-Shopify-Shop-Domain: test-shop.myshopify.com" \
  -d '{"customer":{"id":123,"email":"test@example.com"}}'
```

## 📋 Checklist de Validation

- [ ] App Bridge chargé depuis CDN Shopify
- [ ] OAuth redirige immédiatement vers l'app
- [ ] Session tokens utilisés pour l'auth
- [ ] 3 webhooks GDPR configurés
- [ ] Vérification HMAC implémentée
- [ ] Tables GDPR créées en base
- [ ] Certificat TLS valide
- [ ] Réponses 200 OK pour tous les webhooks

## 🛠️ Développement

```bash
# Démarrer en local
npm run dev

# Tester les Edge Functions
supabase functions serve

# Logs des fonctions
supabase functions logs shopify-oauth
```

## 📚 Documentation

- [Shopify App Bridge](https://shopify.dev/docs/apps/tools/app-bridge)
- [OAuth Shopify](https://shopify.dev/docs/apps/auth/oauth)
- [Webhooks GDPR](https://shopify.dev/docs/apps/webhooks/mandatory-webhooks)
- [Session Tokens](https://shopify.dev/docs/apps/auth/oauth/session-tokens)

## 🔒 Sécurité

- ✅ Vérification HMAC sur tous les webhooks
- ✅ Validation des paramètres OAuth
- ✅ Tokens stockés de manière sécurisée
- ✅ HTTPS obligatoire en production
- ✅ Gestion des erreurs appropriée

## 📞 Support

Pour toute question sur l'implémentation ou les validations Shopify, consultez la documentation officielle ou contactez le support Shopify Partners.