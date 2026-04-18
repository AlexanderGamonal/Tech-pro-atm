# TECH PRO ATM Modular Device Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the app into a catalog organized by brand and shared device family so NCR S2 and BRM content are fully separated and ready for future brands.

**Architecture:** Keep the existing React/Vite app, but move from global mixed datasets and generic tabs to a catalog-driven navigation model with brand view, family view, shared family home, and family-scoped section views. Reuse generic UI components where possible while moving technical content ownership into family-specific data modules.

**Tech Stack:** React 19, Vite, plain JSX components, existing hooks and local data modules

---

## File Structure

### Existing Files To Modify

- `src/App.jsx`
- `src/views/HomeView.jsx`
- `src/views/ErrorView.jsx`
- `src/views/PartsView.jsx`
- `src/views/LEDRefView.jsx`
- `src/data/errors.js`
- `src/data/parts.js`

### New Files To Create

- `src/data/catalog/brands.js`
- `src/data/devices/ncr/s2/metadata.js`
- `src/data/devices/ncr/s2/errors.js`
- `src/data/devices/ncr/s2/parts.js`
- `src/data/devices/ncr/s2/sections.js`
- `src/data/devices/ncr/brm/metadata.js`
- `src/data/devices/ncr/brm/errors.js`
- `src/data/devices/ncr/brm/parts.js`
- `src/data/devices/ncr/brm/leds.js`
- `src/data/devices/ncr/brm/sections.js`
- `src/components/device/BrandCard.jsx`
- `src/components/device/FamilyCard.jsx`
- `src/components/device/DeviceHeader.jsx`
- `src/components/device/DeviceSectionCard.jsx`
- `src/views/brands/BrandsView.jsx`
- `src/views/brands/BrandFamiliesView.jsx`
- `src/views/device/DeviceHomeView.jsx`
- `src/lib/deviceCatalog.js`

### Verification Files

- `package.json`

## Task 1: Catalog Data Extraction

**Files:**
- Create: `src/data/catalog/brands.js`
- Create: `src/data/devices/ncr/s2/metadata.js`
- Create: `src/data/devices/ncr/s2/errors.js`
- Create: `src/data/devices/ncr/s2/parts.js`
- Create: `src/data/devices/ncr/s2/sections.js`
- Create: `src/data/devices/ncr/brm/metadata.js`
- Create: `src/data/devices/ncr/brm/errors.js`
- Create: `src/data/devices/ncr/brm/parts.js`
- Create: `src/data/devices/ncr/brm/leds.js`
- Create: `src/data/devices/ncr/brm/sections.js`
- Modify: `src/data/errors.js`
- Modify: `src/data/parts.js`

- [ ] **Step 1: Inspect the existing exported datasets and identify exact S2 and BRM boundaries**

Run: `Get-Content src/data/errors.js`
Expected: Confirm the current error exports already separate S2 and BRM arrays that can be migrated without mixing records.

- [ ] **Step 2: Write the failing import smoke check by attempting to import the future catalog module in App**

Example target import to prepare for:

```jsx
import { brandsCatalog } from "./data/catalog/brands";
```

Expected: Build fails until the catalog file exists.

- [ ] **Step 3: Create family metadata modules**

Example contents:

```jsx
export const s2Metadata = {
  brandId: "ncr",
  familyId: "ncr-s2-6623-6627",
  brandName: "NCR",
  familyName: "6623 / 6627",
  technology: "S2 Dispenser",
  models: ["6623", "6627"],
  description: "Dispensador NCR con familia S2 para diagnostico, errores y partes.",
};
```

```jsx
export const brmMetadata = {
  brandId: "ncr",
  familyId: "ncr-brm-6683-6687",
  brandName: "NCR",
  familyName: "6683 / 6687",
  technology: "BRM",
  models: ["6683", "6687"],
  description: "Reciclador NCR BRM con referencia tecnica, errores y partes.",
};
```

- [ ] **Step 4: Create family-owned data modules by re-exporting the existing arrays into their new folders**

Example contents:

```jsx
export const s2Errors = [
  // Move the current S2 records from src/data/errors.js into this file.
];
```

```jsx
export const brmErrors = [
  // Move the current BRM records from src/data/errors.js into this file.
];
```

```jsx
export const s2Parts = [
  // Move the current S2 part records from src/data/parts.js into this file.
];
```

```jsx
export const brmParts = [
  // Move the current BRM part records from src/data/parts.js into this file.
];
```

- [ ] **Step 5: Define family section registries**

Example contents:

```jsx
export const s2Sections = [
  { id: "errors", label: "Errores" },
  { id: "parts", label: "Partes" },
];
```

```jsx
export const brmSections = [
  { id: "errors", label: "Errores" },
  { id: "parts", label: "Partes" },
  { id: "leds", label: "LEDs" },
];
```

- [ ] **Step 6: Create the brand catalog**

Example contents:

```jsx
import { s2Metadata } from "../devices/ncr/s2/metadata";
import { s2Sections } from "../devices/ncr/s2/sections";
import { brmMetadata } from "../devices/ncr/brm/metadata";
import { brmSections } from "../devices/ncr/brm/sections";

export const brandsCatalog = [
  {
    id: "ncr",
    name: "NCR",
    families: [
      { ...s2Metadata, sections: s2Sections },
      { ...brmMetadata, sections: brmSections },
    ],
  },
];
```

- [ ] **Step 7: Keep backward-compatible exports temporarily while the UI is being migrated**

Example contents for `src/data/errors.js`:

```jsx
export { s2Errors as S2 } from "./devices/ncr/s2/errors";
export { brmErrors as BRM } from "./devices/ncr/brm/errors";
```

Example contents for `src/data/parts.js`:

```jsx
import { s2Parts } from "./devices/ncr/s2/parts";
import { brmParts } from "./devices/ncr/brm/parts";

export const S2P = s2Parts;
export const BRMP = brmParts;
export const ALLP = [...S2P, ...BRMP];
```

- [ ] **Step 8: Run the build after extraction**

Run: `npm run build`
Expected: PASS, proving the data modules compile before UI refactoring begins.

- [ ] **Step 9: Commit the extraction step**

```bash
git add src/data
git commit -m "refactor: extract NCR families into catalog modules"
```

## Task 2: Navigation Model Refactor

**Files:**
- Create: `src/lib/deviceCatalog.js`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write the failing state shape in App for brand and family navigation**

Example state additions:

```jsx
const [activeBrandId, setActiveBrandId] = useState(null);
const [activeFamilyId, setActiveFamilyId] = useState(null);
const [activeSectionId, setActiveSectionId] = useState(null);
```

Expected: Existing view selection logic becomes incomplete until routing helpers are updated.

- [ ] **Step 2: Create catalog helper functions**

Example contents:

```jsx
import { brandsCatalog } from "../data/catalog/brands";

export function getBrandById(brandId) {
  return brandsCatalog.find((brand) => brand.id === brandId) ?? null;
}

export function getFamilyById(brandId, familyId) {
  const brand = getBrandById(brandId);
  return brand?.families.find((family) => family.familyId === familyId) ?? null;
}
```

- [ ] **Step 3: Replace the global tab-first navigation with level-based navigation**

Example render model:

```jsx
const currentBrand = activeBrandId ? getBrandById(activeBrandId) : null;
const currentFamily =
  activeBrandId && activeFamilyId ? getFamilyById(activeBrandId, activeFamilyId) : null;
```

```jsx
if (!currentBrand) {
  return <BrandsView brands={brandsCatalog} onSelectBrand={setActiveBrandId} />;
}

if (!currentFamily) {
  return (
    <BrandFamiliesView
      brand={currentBrand}
      onBack={() => setActiveBrandId(null)}
      onSelectFamily={setActiveFamilyId}
    />
  );
}

if (!activeSectionId) {
  return (
    <DeviceHomeView
      family={currentFamily}
      onBack={() => setActiveFamilyId(null)}
      onSelectSection={setActiveSectionId}
    />
  );
}
```

- [ ] **Step 4: Add back-navigation reset rules**

Example behavior:

```jsx
const handleBackToBrands = () => {
  setActiveBrandId(null);
  setActiveFamilyId(null);
  setActiveSectionId(null);
};
```

```jsx
const handleBackToFamilies = () => {
  setActiveFamilyId(null);
  setActiveSectionId(null);
};
```

```jsx
const handleBackToFamilyHome = () => {
  setActiveSectionId(null);
};
```

- [ ] **Step 5: Keep theme and favorites state intact during navigation refactor**

Expected: Theme toggle and favorites hook remain in App and are passed down only where needed.

- [ ] **Step 6: Run the build after navigation refactor**

Run: `npm run build`
Expected: FAIL initially until the new views are created, then PASS after Task 3 and Task 4.

- [ ] **Step 7: Commit the navigation step**

```bash
git add src/App.jsx src/lib src/views
git commit -m "refactor: switch app navigation to brand and family flow"
```

## Task 3: Brand and Family Discovery Views

**Files:**
- Create: `src/components/device/BrandCard.jsx`
- Create: `src/components/device/FamilyCard.jsx`
- Create: `src/views/brands/BrandsView.jsx`
- Create: `src/views/brands/BrandFamiliesView.jsx`
- Modify: `src/views/HomeView.jsx`

- [ ] **Step 1: Create a reusable brand card**

Example contents:

```jsx
export function BrandCard({ brand, onClick }) {
  return (
    <button type="button" onClick={onClick} className="card-cyber nc">
      <div className="font-orbitron">{brand.name}</div>
    </button>
  );
}
```

- [ ] **Step 2: Create a reusable family card**

Example contents:

```jsx
export function FamilyCard({ family, onClick }) {
  return (
    <button type="button" onClick={onClick} className="card-cyber nc">
      <div className="font-orbitron">{family.familyName}</div>
      <div>{family.technology}</div>
      <div>{family.models.join(" / ")}</div>
    </button>
  );
}
```

- [ ] **Step 3: Create the brands view**

Example contents:

```jsx
import { BrandCard } from "../../components/device/BrandCard";

export function BrandsView({ brands, onSelectBrand }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2 className="font-orbitron">TECH PRO ATM</h2>
      <p>Selecciona una marca</p>
      <div style={{ display: "grid", gap: "14px" }}>
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} onClick={() => onSelectBrand(brand.id)} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create the brand families view**

Example contents:

```jsx
import { FamilyCard } from "../../components/device/FamilyCard";

export function BrandFamiliesView({ brand, onBack, onSelectFamily }) {
  return (
    <div style={{ padding: "20px" }}>
      <button type="button" onClick={onBack}>Volver</button>
      <h2 className="font-orbitron">{brand.name}</h2>
      <p>Selecciona una familia de cajeros</p>
      <div style={{ display: "grid", gap: "14px" }}>
        {brand.families.map((family) => (
          <FamilyCard
            key={family.familyId}
            family={family}
            onClick={() => onSelectFamily(family.familyId)}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Retire or repurpose the old home view**

Expected: `HomeView.jsx` is either removed from the App flow or turned into a simple wrapper that is no longer the main entry point.

- [ ] **Step 6: Run the build after discovery views are added**

Run: `npm run build`
Expected: PASS once App imports the new views correctly.

- [ ] **Step 7: Commit the discovery views**

```bash
git add src/components/device src/views/brands src/views/HomeView.jsx
git commit -m "feat: add brand and family discovery views"
```

## Task 4: Shared Family Home and Section Cards

**Files:**
- Create: `src/components/device/DeviceHeader.jsx`
- Create: `src/components/device/DeviceSectionCard.jsx`
- Create: `src/views/device/DeviceHomeView.jsx`

- [ ] **Step 1: Create a reusable device header**

Example contents:

```jsx
export function DeviceHeader({ family, onBack }) {
  return (
    <div style={{ display: "grid", gap: "10px" }}>
      <button type="button" onClick={onBack}>Volver</button>
      <h2 className="font-orbitron">{family.brandName}</h2>
      <div>{family.familyName} - {family.technology}</div>
      <div>Modelos: {family.models.join(", ")}</div>
      <p>{family.description}</p>
    </div>
  );
}
```

- [ ] **Step 2: Create a section card component**

Example contents:

```jsx
export function DeviceSectionCard({ section, onClick }) {
  return (
    <button type="button" onClick={onClick} className="card-cyber nc">
      <div className="font-orbitron">{section.label}</div>
    </button>
  );
}
```

- [ ] **Step 3: Create the shared family home view**

Example contents:

```jsx
import { DeviceHeader } from "../../components/device/DeviceHeader";
import { DeviceSectionCard } from "../../components/device/DeviceSectionCard";

export function DeviceHomeView({ family, onBack, onSelectSection }) {
  return (
    <div style={{ padding: "20px" }}>
      <DeviceHeader family={family} onBack={onBack} />
      <div style={{ display: "grid", gap: "14px", marginTop: "24px" }}>
        {family.sections.map((section) => (
          <DeviceSectionCard
            key={section.id}
            section={section}
            onClick={() => onSelectSection(section.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify the family home renders before any section content**

Expected: Selecting a family lands on its profile cards, not directly inside errors or parts.

- [ ] **Step 5: Run the build after creating the family home**

Run: `npm run build`
Expected: PASS

- [ ] **Step 6: Commit the family home**

```bash
git add src/components/device src/views/device
git commit -m "feat: add shared family home with section cards"
```

## Task 5: Family-Scoped Section Views

**Files:**
- Modify: `src/views/ErrorView.jsx`
- Modify: `src/views/PartsView.jsx`
- Modify: `src/views/LEDRefView.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Update ErrorView to accept family-scoped datasets**

Example props:

```jsx
export function ErrorView({
  family,
  errors,
  query,
  onQueryChange,
  favorites,
  onToggleFav,
  onBack,
}) {
```

Expected: ErrorView no longer depends on both S2 and BRM global arrays at once.

- [ ] **Step 2: Update PartsView to accept only the active family parts**

Example props:

```jsx
export function PartsView({
  family,
  parts,
  query,
  onQueryChange,
  favorites,
  onToggleFav,
  onBack,
}) {
```

- [ ] **Step 3: Update LEDRefView to support family-specific availability**

Example rendering rule:

```jsx
if (!family || family.familyId !== "ncr-brm-6683-6687") {
  return null;
}
```

- [ ] **Step 4: In App, derive datasets from the selected family**

Example pattern:

```jsx
const familyDataMap = {
  "ncr-s2-6623-6627": {
    errors: s2Errors,
    parts: s2Parts,
    leds: null,
  },
  "ncr-brm-6683-6687": {
    errors: brmErrors,
    parts: brmParts,
    leds: brmLeds,
  },
};
```

- [ ] **Step 5: Route sections through the family data map**

Example render branch:

```jsx
if (activeSectionId === "errors") {
  return (
    <ErrorView
      family={currentFamily}
      errors={currentFamilyData.errors}
      query={query}
      onQueryChange={setQuery}
      favorites={favorites}
      onToggleFav={toggleFavorite}
      onBack={handleBackToFamilyHome}
    />
  );
}
```

- [ ] **Step 6: Make favorites identifiers family-aware if collisions exist**

Example id format:

```jsx
const favoriteId = `${family.familyId}:error:${item.code}`;
```

- [ ] **Step 7: Run targeted verification**

Run: `npm run build`
Expected: PASS, with manual spot checks confirming S2 and BRM content do not mix.

- [ ] **Step 8: Commit the section scoping**

```bash
git add src/App.jsx src/views src/hooks
git commit -m "refactor: scope sections to the active device family"
```

## Task 6: Branding and Cleanup

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/views/brands/BrandsView.jsx`
- Modify: any title text still using `NCR TECH`

- [ ] **Step 1: Replace the global header title**

Example header text:

```jsx
<div className="font-orbitron" style={{ fontSize: "14px", color: "var(--c-accent)" }}>
  TECH PRO ATM
</div>
```

- [ ] **Step 2: Remove obsolete mixed labels**

Examples to replace:

- `Dispensadores 6623/6627 · Recicladores 6683/6687`
- `Partes S2 Dispensadores · BRM Recicladores`

Expected: No top-level copy should imply the families are mixed into one flat home.

- [ ] **Step 3: Confirm obsolete imports are removed**

Expected: `App.jsx` no longer imports mixed arrays directly from `src/data/errors` and `src/data/parts` for top-level filtering.

- [ ] **Step 4: Run final build verification**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Review final user flow manually**

Verify:
- app opens on brands
- NCR opens to family cards
- family opens to section cards
- sections render correct data
- back navigation returns to the correct previous level

- [ ] **Step 6: Commit final cleanup**

```bash
git add src
git commit -m "feat: launch TECH PRO ATM modular family navigation"
```
