# Assessoria 3.0 · Captació local

Primera versió de la landing page i demostració del panell comercial, preparada per a Next.js i Vercel.

## Què funciona
- Landing en català i adaptada a mòbil.
- Enllaç de WhatsApp amb text predefinit (configurable).
- Formulari de contacte i pujada de factura PDF/imatge, **quan Supabase estigui configurat**.
- Desa factures en bucket privat i les dades del contacte en taula protegida per RLS.
- Panell `/panell` amb simulador i contactes **ficticis**, sense dades comercials reals.

## Què no està connectat encara
- Captació real en directoris o Google Maps, anuncis de Google/Meta, anàlisi OCR/IA, càlcul amb tarifes reals, generació d'ofertes i exportació al CRM.
- WhatsApp automatitzat (només obre una conversa amb l'empresa).
- Dashboard amb dades reals i login. **No es pot utilitzar `/panell` com a panell de producció sense autenticació.**

## Desplegament
1. A Vercel: crear nou projecte importat des de GitHub o pujar aquesta carpeta a un repositori Git i importar-lo.
2. Crear projecte Supabase. Executar `supabase.sql` a l'editor SQL.
3. A Vercel, configurar `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (només servidor; mai exposar al navegador) i `NEXT_PUBLIC_WHATSAPP_NUMBER`.
4. Executar `npm install && npm run build` i desplegar.
5. **Abans de campanyes públiques:** afegir CAPTCHA, límits de peticions, protecció antispam, antivirus de fitxers, auditoria RGPD i retenció; completar l'avís legal i les polítiques de privacitat, verificació telèfon i dominis.
6. Revisar el logo i els colors amb la identitat corporativa oficial: s'ha creat un isotip tipogràfic provisional.

## Arquitectura recomanada del sistema complet

Captació consentida amb Google/Meta Ads + landing → lead a Supabase → fitxer privat → extractor de factures (OCR/IA i comprovació humana de camps insegurs) → motor determinista amb catàleg versionat de tarifes, impostos, potències, períodes i SAS → oferta PDF → WhatsApp Business API (consentiment/plantilles) → signatura i integració amb CRM (subjecte a API disponible).

Prospecció de negocis de la zona: importar només dades empresarials d'una font autoritzada; verificar límits d'ús i normativa LSSI/RGPD abans d'enviar campanyes. No fer enviaments massius a telèfons personals obtinguts de directoris.

## Seguretat
- No exposeu la `SUPABASE_SERVICE_ROLE_KEY` com a variable `NEXT_PUBLIC_*`.
- No configureu el bucket `factures` com a públic.
- La ruta de pujada no processa les factures amb IA i no les transmet a tercers a part del vostre Supabase.
- Abans de producció: implantar registre de consentiment verificable, expiració/retenció i esborrat, DPA amb proveïdors, protecció contra abús, fitxers maliciosos i accessos autenticats.
