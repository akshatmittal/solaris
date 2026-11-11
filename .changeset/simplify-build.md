---
"solariskit": patch
---

Simplify the build. The `[data-rk]` selector prefix now comes from the Lightning CSS step in the StyleX plugin, so PostCSS, Autoprefixer, `postcss-prefix-selector`, and `@rollup/plugin-replace` are no longer dev dependencies. `styles.css` drops vendor prefixes that the default browserslist does not need, such as `-moz-appearance` and `::-moz-placeholder`. The package version is set with tsdown `define`, and translations load as JSON.
