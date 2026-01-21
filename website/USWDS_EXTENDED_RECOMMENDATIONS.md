# Recommendations for `uswds-extended` Package

## 1. Critical Fix: SASS API Compatibility
**Issue**: The package uses `includePaths` in its Gulp SASS configuration. This option is deprecated/unsupported in modern `sass-embedded` (Dart Sass) versions, causing build failures or incorrect warnings.
**Fix**: Change `includePaths` to `loadPaths` in `compile/index.js`.

```javascript
// compile/index.js

// OLD
sass({
  outputStyle: "expanded",
  includePaths: buildSettings.includes, 
  // ...
})

// NEW
sass({
  outputStyle: "expanded",
  loadPaths: buildSettings.includes, // <--- REQUIRED for sass-embedded
  // ...
})
```

## 2. Recommendation: Standardize Default Asset Paths
**Issue**: The package defaults to `assets/uswds/img`, `assets/uswds/js`, etc.
**Impact**: This breaks "drop-in" compatibility for existing USWDS projects (validating the "extended" promise) which typically expect assets in `assets/img`, `assets/js`, etc. Users are forced to manually override paths in `gulpfile.js` to match the standard behavior.
**Recommendation**: Remove the `uswds/` subdirectory from default paths to match `@uswds/compile` behavior.

```javascript
// compile/index.js (Default Settings)

// CURRENT
dist: {
  theme: "./sass",
  img: "./assets/uswds/img",
  fonts: "./assets/uswds/fonts",
  js: "./assets/uswds/js",
  css: "./assets/uswds/css",
  // ...
}

// RECOMMENDED
dist: {
  theme: "./sass",
  img: "./assets/img",
  fonts: "./assets/fonts",
  js: "./assets/js",
  css: "./assets/css",
  // ...
}
```

## 3. Confirmed Fix: Dynamic Path Resolution
**Issue**: The package was incorrectly resolving paths to a potentially empty `@uswds/uswds` placeholder instead of the bundled packages.
**Status**: Fixed in v3.14.7 via dynamic `resolvePackagePath` logic. Ensure this logic remains robust.
