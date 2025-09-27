# Logo Setup Anleitung

## 🎨 Logo einbinden

### 1. Logo-Datei hinzufügen
Legen Sie Ihr Logo in den Ordner `web/public/images/` ab:
- **Dateiname:** `logo.png` (empfohlen)
- **Formate:** PNG, JPG, SVG
- **Größe:** Empfohlen 200x200px oder höher für beste Qualität

### 🖼️ Logo-Optimierung für Fotos
Wenn Sie ein normales Foto als Logo verwenden möchten, haben Sie mehrere Optionen:

#### **Option A: CSS-basierte Transparenz (Sofort verfügbar)**
```tsx
<Logo style="transparent" />  // Entfernt Hintergrund automatisch
<Logo style="circular" />     // Rundes Logo mit Rahmen
<Logo style="outlined" />    // Logo mit Umriss
```

#### **Option B: Online-Tools für echte Transparenz**
1. **Remove.bg** (https://remove.bg) - Automatische Hintergrund-Entfernung
2. **Canva** (https://canva.com) - Logo-Design mit transparentem Hintergrund
3. **GIMP** (kostenlos) - Manuelle Hintergrund-Entfernung

### 2. Unterstützte Formate
- **PNG:** Beste Qualität mit Transparenz
- **JPG:** Für Fotos/komplexe Logos
- **SVG:** Vektorgrafik, skalierbar

### 3. Automatische Integration
Das Logo wird automatisch an folgenden Stellen angezeigt:
- **Homepage:** Großes Logo mit Text
- **Andere Seiten:** Über die Logo-Komponente

### 4. Logo-Komponente verwenden
```tsx
import Logo from "@/components/Logo";

// Verschiedene Größen
<Logo size="sm" showText={false} />  // Nur Icon, klein
<Logo size="md" showText={true} />  // Icon + Text, mittel
<Logo size="lg" showText={true} />  // Icon + Text, groß
```

### 5. Fallback-Verhalten
- Wenn kein Logo vorhanden ist, wird nur der Text angezeigt
- Keine Fehler oder leere Bereiche
- Automatische Anpassung an verschiedene Bildschirmgrößen

### 6. Optimierung
- **WebP-Format:** Für bessere Performance (optional)
- **Responsive:** Logo passt sich automatisch an
- **Lazy Loading:** Wird nur geladen, wenn sichtbar

## 📁 Dateistruktur
```
web/
├── public/
│   └── images/
│       └── logo.png          ← Ihr Logo hier
├── src/
│   └── components/
│       └── Logo.tsx          ← Logo-Komponente
└── src/app/
    └── page.tsx              ← Homepage mit Logo
```

## 🚀 Sofort einsatzbereit!
Nach dem Hinzufügen der Logo-Datei ist alles automatisch konfiguriert.
