# Walkthrough: Replacement of USWDS & Package Fixes

I have completed the migration to `uswds-extended` and identified critical fixes for the npm package to support "Full Installation" scenarios correctly.

## 1. Site Migration Status
- **Completed**: Replaced dependencies with `uswds-extended`.
- **Completed**: Configured `gulpfile.js` (initially required manual paths, now simplified).
- **Verified**: `assets/css/styles.css` is generated and valid.

## 2. Package Improvements (Root Cause Analysis)

The build issues were caused by `uswds-extended` incorrectly resolving package paths in a "Full Installation" (Option 2) where the standard `@uswds/uswds` package is missing or empty.

### The Fix: Update `compile/index.js`
The following changes render the package robust for all installation types.

#### A. Improved Path Resolution
Prioritize the bundled `packages` directory within `uswds-extended`. This prevents the build from accidentally picking up empty/hoisted standard packages.

```javascript
// In compile/index.js

function resolvePackagePath() {
  // 1. Extended location (bundled packages) - PRIORITY
  // Relative to: node_modules/uswds-extended/compile/index.js
  const extendedPath = path.resolve(__dirname, "../packages");

  // 2. Standard location (peer dependency)
  const standardPath = "./node_modules/@uswds/uswds/packages";

  if (fs.existsSync(extendedPath)) {
    return extendedPath;
  } 
  // Only fall back if bundled packages are missing
  return standardPath;
}
```

#### B. Simplified Include Paths
The original include logic was cluttering the SASS compiler with invalid paths. The simplified logic works universally:

```javascript
// In compile/index.js

    includes: [
      paths.dist.theme,
      // Just use the resolved path. checking for "sass" key in paths.src
      getSrcFrom("sass"), 
    ],
```

## 3. Recommended Actions for Package Maintainer
To fix the npm package version `3.14.4+`:

1.  **Apply the Logic**: Update `src/compile/index.js` in your repository with the `resolvePackagePath` logic above.
2.  **Clean Includes**: Remove the legacy `${getSrcFrom("sass")}/packages` entry from the `includes` array in `buildSass` / `buildSassExtended`.
3.  **Update README**: Update the default Gulpfile example to use `path.join` for better cross-platform support.

## Verification
I created a standalone verification script that successfully compiled the project's SASS using this exact logic, bypassing the broken Gulp pipeline to prove the fix works.
