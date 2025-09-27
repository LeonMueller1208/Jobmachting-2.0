# Design System Documentation

## Globale CSS-Variablen

Alle Design-System-Werte sind in `globals.css` als CSS-Variablen definiert:

### Farben
- `--background: #F6F8FC` - Kühler Pastellton als Hintergrund
- `--foreground: #1E2A38` - Tiefes Marineblau als Primärtextfarbe
- `--accent-blue: #3A86FF` - Dynamisches Blau für Suchende
- `--accent-blue-dark: #1E5BFF` - Dunkleres Blau für Hover-Effekte
- `--accent-green: #06C755` - Frisches Grün für Anbietende
- `--accent-green-dark: #05A84A` - Dunkleres Grün für Hover-Effekte

### Typografie
- `--font-primary: 'Inter', system-ui, -apple-system, sans-serif` - Primärschriftart

### Spacing & Radius
- `--border-radius-card: 20px` - Weiche Ecken für Cards
- `--border-radius-input: 12px` - Ecken für Input-Felder
- `--border-radius-button: 12px` - Ecken für Buttons

### Schatten
- `--shadow-card: 0 8px 30px rgba(0, 0, 0, 0.08)` - Weicher Kartenschatten
- `--shadow-card-hover: 0 12px 40px rgba(0, 0, 0, 0.12)` - Verstärkter Hover-Schatten
- `--shadow-button-blue: 0 4px 15px rgba(58, 134, 255, 0.3)` - Blauer Button-Schatten
- `--shadow-button-green: 0 4px 15px rgba(6, 199, 85, 0.3)` - Grüner Button-Schatten

## Design System Klassen

### Layout & Background
- `.ds-background` - Anwendet den globalen Hintergrund
- `.ds-card` - Standard-Card mit Schatten und weichen Ecken
- `.ds-card-hover` - Hover-Effekte für Cards (Lift + Schatten)

### Typografie
- `.ds-heading` - Hauptüberschriften (extrabold, Inter)
- `.ds-subheading` - Unterüberschriften (bold)
- `.ds-body` - Fließtext
- `.ds-body-light` - Heller Fließtext (70% Opacity)
- `.ds-label` - Formular-Labels

### Buttons
- `.ds-button-primary-blue` - Primärer blauer Button mit Schatten
- `.ds-button-primary-green` - Primärer grüner Button mit Schatten
- `.ds-button-secondary` - Sekundärer Button

### Formulare
- `.ds-input` - Standard-Input-Styling
- `.ds-input-focus-blue` - Blaue Fokus-Ring für Inputs
- `.ds-input-focus-green` - Grüner Fokus-Ring für Inputs

### Links
- `.ds-link` - Standard-Link-Styling
- `.ds-link-blue` - Blauer Akzent-Link
- `.ds-link-green` - Grüner Akzent-Link

### Icons
- `.ds-icon-container-blue` - Blauer Icon-Hintergrund
- `.ds-icon-container-green` - Grüner Icon-Hintergrund
- `.ds-icon-blue` - Blaue Icon-Farbe
- `.ds-icon-green` - Grüne Icon-Farbe

### Skill Tags
- `.ds-skill-tag` - Basis-Skill-Tag-Styling
- `.ds-skill-tag-blue` - Blauer Skill-Tag
- `.ds-skill-tag-green` - Grüner Skill-Tag
- `.ds-skill-tag-default` - Standard Skill-Tag

## Verwendung

### Beispiel: Card mit Hover-Effekt
```html
<div className="ds-card ds-card-hover p-8">
  <h2 className="ds-heading">Titel</h2>
  <p className="ds-body">Inhalt</p>
</div>
```

### Beispiel: Formular
```html
<form>
  <label className="ds-label">E-Mail</label>
  <input className="ds-input ds-input-focus-blue" type="email" />
  <button className="ds-button-primary-blue">Absenden</button>
</form>
```

### Beispiel: Navigation
```html
<Link href="/path" className="ds-link-blue">
  Navigation
</Link>
```

## Vorteile

1. **Konsistenz**: Alle Komponenten verwenden die gleichen Design-Tokens
2. **Wartbarkeit**: Änderungen an zentralen Variablen wirken sich global aus
3. **Skalierbarkeit**: Neue Komponenten erben automatisch das Design-System
4. **Performance**: CSS-Variablen werden effizient vom Browser gecacht
5. **Entwicklerfreundlichkeit**: Klare, semantische Klassennamen

## Migration

Um bestehende Komponenten zu migrieren:

1. Ersetze hardcodierte Farben durch Design-System-Klassen
2. Verwende `.ds-card` statt individueller Card-Styles
3. Nutze `.ds-button-primary-*` für CTA-Buttons
4. Verwende `.ds-input` + `.ds-input-focus-*` für Formulare
5. Ersetze Typografie-Klassen durch `.ds-heading`, `.ds-body`, etc.
