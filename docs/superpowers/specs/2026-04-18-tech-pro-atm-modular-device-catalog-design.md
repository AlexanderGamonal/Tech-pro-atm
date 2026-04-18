# TECH PRO ATM Modular Device Catalog Design

## Summary

This document defines the approved refactor of the current ATM support app into a modular catalog organized by brand and device family. The immediate scope covers NCR families `6623/6627 - S2 Dispenser` and `6683/6687 - BRM`, with a structure designed to support additional brands and families later.

## Goals

- Show brands first on app entry.
- Let users navigate from brand to device family.
- Use one shared technical profile per family, not one screen per individual model.
- Separate S2 and BRM content so each family only shows its own data.
- Replace the current mixed experience with modular data and views that scale to more brands and models.
- Change the global app header to `TECH PRO ATM`.

## Non-Goals

- Do not create individual screens for models `6623`, `6627`, `6683`, or `6687`.
- Do not add new brands in this phase beyond creating the architecture that supports them.
- Do not redesign the entire visual system beyond the navigation and branding changes needed for this refactor.

## Current Problem

The current app already has some separation into views and data files, but the user experience still mixes multiple ATM families into the same search and content flow. S2 dispenser data and BRM recycler data are treated as filters under generic sections instead of first-class device families. This makes navigation confusing now and makes future expansion harder.

## Approved User Experience

### Navigation Hierarchy

The app will use this navigation hierarchy:

1. Brands
2. Families within a brand
3. Shared family profile
4. Section within the family

### Initial Catalog

The first release of the modular structure will expose:

- Brand: `NCR`
- Family: `6623 / 6627 - S2 Dispenser`
- Family: `6683 / 6687 - BRM`

### Family Profile Experience

When a user enters a family, they will see a shared profile for that family with:

- Family name
- Included models
- Technology name
- Short description
- Internal cards for the available sections

The user will not land directly inside `Errors`, `Parts`, or `LEDs`. Instead, they will first see section cards such as:

- `Errores`
- `Partes`
- `LEDs`
- `Referencia BRM`

Only after selecting one of those cards will the app open that specific section.

## Information Architecture

### Catalog Model

The application will define a catalog-driven structure with these entities:

- `brand`
- `family`
- `models`
- `technology`
- `description`
- `availableSections`
- `dataSources`

Each family entry will be a self-contained registration that points to the data and sections it supports.

### Data Ownership

Technical content will be organized by device family instead of by global mixed datasets. NCR content will be split into two clear modules:

- `NCR 6623/6627 - S2 Dispenser`
- `NCR 6683/6687 - BRM`

Each family will own its own technical datasets such as:

- error codes
- part catalogs
- LED references
- metadata
- optional section-specific helpers

## Proposed File Structure

The refactor will move toward the following structure:

```text
src/
  components/
    device/
      DeviceHeader.jsx
      DeviceSectionCard.jsx
      FamilyCard.jsx
      BrandCard.jsx
  data/
    catalog/
      brands.js
    devices/
      ncr/
        s2/
          metadata.js
          errors.js
          parts.js
          sections.js
        brm/
          metadata.js
          errors.js
          parts.js
          leds.js
          sections.js
  views/
    brands/
      BrandsView.jsx
      BrandFamiliesView.jsx
    device/
      DeviceHomeView.jsx
      DeviceErrorsView.jsx
      DevicePartsView.jsx
      DeviceLedsView.jsx
```

Existing shared UI can be retained when useful, but ownership of technical data must move into family-specific modules.

## Application State

The root application state will track:

- active brand
- active family
- active section
- shared UI state such as theme and favorites

This replaces the current behavior where multiple families are combined into global filters under one generic tab flow.

## View Design

### Brands View

The new entry screen shows available brands first. For now, only `NCR` will be rendered, but the view must be built to support additional brands without structural changes.

### Brand Families View

Selecting a brand opens the list of device families under that brand. For `NCR`, this will initially display:

- `6623 / 6627 - S2 Dispenser`
- `6683 / 6687 - BRM`

### Device Home View

Selecting a family opens its shared profile page with summary information and section cards.

### Section Views

Each section view receives the active family as context and only renders the datasets that belong to that family.

Examples:

- `S2` family error view shows only S2 errors
- `BRM` family parts view shows only BRM parts
- `BRM` family can expose LED/reference content
- `S2` family can omit unsupported sections or show only those registered in its section map

## Reuse Strategy

Reusable UI components should remain generic, but technical data should be family-owned. This keeps the UI DRY while making content boundaries explicit.

Examples of reusable pieces:

- search inputs
- cards
- expandable result rows
- favorites hooks
- generic section list rendering

Examples of family-owned content:

- datasets
- labels specific to a family
- section availability
- metadata and descriptions

## Error Handling and Edge Cases

- If a family does not support a section, that card should not be shown.
- If a brand has no families yet, the brand view should render an empty state instead of breaking.
- Invalid navigation state should safely return the user to the nearest valid level, preferably the family list or brands view.
- Existing favorites should continue working, but identifiers may need to become family-aware so that similarly named items do not collide across families.

## Testing Strategy

The refactor should be verified through:

- navigation checks from brands to family to section
- data boundary checks ensuring S2 and BRM content no longer mix
- section visibility checks based on family capabilities
- regression checks for search, expand/collapse, favorites, and theme behavior
- build verification to ensure the modularized imports remain valid

## Success Criteria

The work is successful when:

- the home screen shows brands first
- the header reads `TECH PRO ATM`
- `NCR` opens into two family cards
- each family opens a shared profile, not a model-specific page
- sections are entered through internal cards
- each family only shows its own technical content
- the codebase is ready to add new brands and families without rewriting the app structure

## Rollout Notes

This refactor is intended to be a structural cleanup and growth foundation. The most important outcome is not just a cleaner NCR experience, but a catalog model that allows future brands to be added with minimal changes to navigation and shared UI.
