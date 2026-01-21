# Walkthrough: Replacement of USWDS & Package Fixes

I have completed the migration to `uswds-extended` and identified critical fixes for the npm package to support "Full Installation" scenarios correctly.

## 1. Site Migration Status
- **Completed**: Replaced dependencies with `uswds-extended`.
- **Completed**: Configured `gulpfile.js` (initially required manual paths, now simplified).
- **Verified**: `assets/css/styles.css` is generated and valid.

## 2. Package Improvements (Root Cause Analysis)

The build issues were caused by two factors in `uswds-extended`:
1.  Incorrect path resolution in "Full Installation" scenarios (Fixed in v3.14.5).
2.  **Legacy API Usage**: The package uses `includePaths` (Node Sass API) which `sass-embedded` (Dart Sass) does not reliably support in this Gulp context. It requires `loadPaths`.

### The Fixes: Update `compile/index.js`
The following changes render the package robust for all installation types.

#### A. Improved Path Resolution (Applied in v3.14.5)
*This is verified as present in v3.14.5.*

#### B. API Compatibility (NEW FIX REQUIRED)
The `sass-embedded` compiler requires `loadPaths` instead of `includePaths`.

**Locate `compile/index.js` (around line 324 and 380):**

Change `includePaths` to `loadPaths`:

```javascript
// In buildSass function
    .pipe(
      sass({
        outputStyle: "compressed",
        loadPaths: buildSettings.includes, // <--- CHANGE THIS (was includePaths)
        quietDeps: !settings.compile.sassDeprecationWarnings,
      }).on("error", handleError)
    )

// In buildSassExtended function
      .pipe(
        sass({
          outputStyle: "expanded",
          loadPaths: buildSettings.includes, // <--- CHANGE THIS (was includePaths)
          quietDeps: !settings.compile.sassDeprecationWarnings,
        }).on("error", handleError)
      )
```

## 3. Recommended Actions for Package Maintainer
To fix the npm package version `3.14.6+`:

1.  **Update Sass Option**: Rename `includePaths` to `loadPaths` in both `buildSass` and `buildSassExtended` functions in `src/compile/index.js`.
2.  **Clean Includes**: Remove the legacy `${getSrcFrom("sass")}/packages` entry from the `includes` array if it still exists, as `resolvePackagePath` handles it now.

## Verification
I verified that applying this API change allows the build to successfully locate `uswds-core` and generate the CSS output.
