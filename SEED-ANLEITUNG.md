# 🌱 Seed-Daten für Frankfurt

## 📦 Was wurde erstellt?

Dieses Projekt enthält Demo-Daten für **5 Firmen in Frankfurt** mit **13 passenden Stellenangeboten**:

### Firmen:
1. **TechVision GmbH** (IT & Software) - 3 Jobs
2. **FinanzPro AG** (Finanzwesen) - 2 Jobs  
3. **MediCare Plus** (Gesundheitswesen) - 3 Jobs
4. **LogiFlow Solutions** (Logistik) - 2 Jobs
5. **GreenEnergy GmbH** (Energie) - 3 Jobs

---

## 🚀 Option 1: TypeScript-Script (Empfohlen wenn DB-Verbindung funktioniert)

### Voraussetzungen:
- ✅ `.env` Datei mit gültiger `DATABASE_URL`
- ✅ Supabase-Datenbank läuft

### Ausführen:
```bash
cd web
npm run seed
```

### Bei Problemen:
Falls "Authentication failed" angezeigt wird:
- Prüfe, ob deine Supabase-DB noch aktiv ist
- Checke, ob das Passwort URL-encoded sein muss (Sonderzeichen!)
- Nutze **Option 2** (SQL-Script)

---

## 🎯 Option 2: SQL-Script (Immer funktioniert!)

### Schritt 1: Öffne Supabase
1. Gehe zu [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Wähle dein Projekt aus
3. Klicke im Menü auf **"SQL Editor"**

### Schritt 2: SQL-Script ausführen
1. Öffne die Datei **`web/seed-frankfurt.sql`**
2. Kopiere den gesamten Inhalt (Strg+A, Strg+C)
3. Füge ihn im Supabase SQL Editor ein
4. Klicke auf **"Run"** (▶️)

### Schritt 3: Erfolg prüfen
```sql
-- Prüfe, ob Firmen erstellt wurden
SELECT * FROM "Company" WHERE email LIKE 'demo-%';

-- Prüfe, ob Jobs erstellt wurden  
SELECT COUNT(*) FROM "Job" WHERE location = 'Frankfurt';
```

Du solltest **5 Firmen** und **13 Jobs** sehen! ✅

---

## 🔐 Test-Zugänge für Firmen

Die Demo-Firmen haben folgende E-Mail-Adressen:

| Firma | E-Mail |
|-------|--------|
| TechVision GmbH | demo-techvision@jobmatching.de |
| FinanzPro AG | demo-finanzpro@jobmatching.de |
| MediCare Plus | demo-medicare@jobmatching.de |
| LogiFlow Solutions | demo-logiflow@jobmatching.de |
| GreenEnergy GmbH | demo-greenenergy@jobmatching.de |

⚠️ **Wichtig:** Da dein System keine Passwörter für Companies speichert, musst du diese Firmen **manuell über `/company/login`** registrieren, indem du einfach die E-Mail eingibst (oder den Login-Flow entsprechend anpasst).

---

## 📊 Was kannst du jetzt testen?

### Als Bewerber:
1. Registriere dich als Bewerber mit Frankfurt-Location
2. Sieh dir die 13 Jobs im Dashboard an
3. Filtere nach Branchen (IT, Finanz, Gesundheit, etc.)
4. Bekunde Interesse an Jobs
5. Teste das Matching

### Als Firma:
1. Logge dich mit einer der Demo-Firmen ein
2. Sieh dir deine erstellten Jobs an
3. Warte auf Bewerber-Interests
4. Teste Chat, Analytics, etc.

---

## 🧹 Aufräumen (falls nötig)

Falls du die Demo-Daten wieder löschen möchtest:

```sql
-- Lösche alle Demo-Daten
DELETE FROM "Job" WHERE "companyId" IN (
  SELECT id FROM "Company" WHERE email LIKE 'demo-%'
);

DELETE FROM "Company" WHERE email LIKE 'demo-%';
```

---

## ✅ Nächste Schritte

1. **Führe das SQL-Script aus** (Option 2 ist am einfachsten)
2. **Erstelle Test-Bewerber** mit verschiedenen Profilen
3. **Hole Feedback** von echten Nutzern
4. **Erweitere auf mehr Städte** (München, Berlin, etc.)

---

## 🆘 Hilfe

Bei Problemen:
- Prüfe, ob die Tabellennamen in Supabase korrekt sind (`Company`, `Job`, etc.)
- Checke, ob alle Spalten existieren (`jobType`, `requiredEducation`, etc.)
- Falls IDs bereits existieren, ändere die IDs im SQL-Script

