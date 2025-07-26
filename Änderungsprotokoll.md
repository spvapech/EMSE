# 📘 Änderungsprotokoll – Java-Codeverständnis mit Nof1 (Projekt 01–05)

Diese Datei dokumentiert alle funktionalen und strukturellen Änderungen am Nof1-Java-Codeverständnis-Experiment über fünf aufeinanderfolgende Entwicklungsphasen.

---

## ✅ Projekt 01 – Basisversion

- Einfache Aufgabenvarianten (`Direktausgabe`, `AdditionMod10`, etc.)
- Fokus: **Korrektes Rechnen / Nachvollziehen von Zahlenoperationen**
- Keine Noise-Elemente
- Kommentare (falls vorhanden) statisch und unspezifisch
- Klarer, aber didaktisch reduzierter Aufbau

---

## 🔄 Projekt 02 – Kommentarlogik verbessert

- Einführung kontextsensitiver Kommentare:
    - `System.out.println(...)` mit Array-Zugriff → erkennt Index und benennt ihn explizit
- Zusätzliche Fälle wie: Schleifen, Modulo, Initialisierungen mit spezifischem Feedback
- Verbesserung der didaktischen Struktur durch **codebezogene Erklärungen**
- Fokus noch immer primär auf „Rechnung richtig verstehen“

---

## 🧼 Projekt 03 – Textvereinfachung & UI-Aufräumung

- Einleitungstexte wurden vereinfacht und kürzer formuliert
- Entfernen der Variantenbezeichnung („Variante: ...“) im UI
- Funktionen wie `do_print_error_message` verkürzt (einzeilig)
- **Keine inhaltliche Logikänderung**
- Ziel: Bessere Lesbarkeit, klarere Nutzerführung

---

## 🧠 Projekt 04 – Neue Code-Varianten + systematischer Noise

> 🔁 **Ab hier: Übergang vom „Rechendenken“ zum echten **„Codeverständnis“**

- Neue, strukturell komplexere Aufgaben:
    - `Rekursion` (Fibonacci mit Memoisierung)
    - `NestedLoops` (verschachtelte for-Schleifen)
    - `BoolLogik` (zyklische `true → false` Übergänge)
- Einführung von **Noise-Blöcken**:
    - Irrelevante Zeilen mit Kommentaren wie `// nicht relevant`
    - Dienen als kognitive Ablenkung → Selektionsfähigkeit gefordert
- Formatierte Code-Darstellung:
    - Relevante Kommentare (blau), Ablenkungen (rot)
- Zufällige Variablennamen durch `generateVarNames()`
- Ziel: **Code-Struktur, Kontrollfluss und semantische Erfassung statt nur Rechnen**

---

## 🎲 Projekt 05 – Zufällige Noise-Positionierung

- Neue Funktion: `insertNoiseBlocksRandomly(...)`
    - Fügt Noise-Blöcke **vor, nach oder beidseitig** des Kerncodes ein
- `generateNoiseBlock()` modular genutzt
- Alle Varianten verwenden jetzt einheitlich `insertNoiseBlocksRandomly(...)`
- Weiterer Schritt in Richtung **alltagsähnlicher, realitätsnäherer Codeverständnis-Aufgaben**

---

## 📌 Zusammenfassung

| Projekt | Fokus                         | Hauptänderung                                                |
|---------|-------------------------------|--------------------------------------------------------------|
| 01      | Rechenverständnis             | Einfache Operationen (Modulo, Summen etc.)                   |
| 02      | Rechnen + Erklärung           | Kontextsensitive Kommentare helfen beim Nachvollziehen       |
| 03      | Lesbarkeit & UI               | Kürzere Texte, aufgeräumtes Layout                           |
| 04      | **Codeverständnis beginnt**   | Neue Varianten, Noise, Kommentierung, strukturierter Code    |
| 05      | Komplexitätssteigerung        | Noise-Positionierung dynamisch – Fokus auf kognitive Selektion|

---

