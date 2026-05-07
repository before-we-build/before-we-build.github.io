# Before We Build LLM Wiki site

Static GitHub Pages site for the Before We Build LLM Wiki.

URL after Pages deployment: <https://before-we-build.github.io/>

Source wiki: <https://github.com/before-we-build/before-we-build-research>

## Local preview

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>.

## Notes

- Dependency-free static HTML/CSS/JS.
- Visualizations are generated in `assets/site.js`.
- Future improvement: generate graph data automatically from `before-we-build-research/wiki/**/*.md` wikilinks.
