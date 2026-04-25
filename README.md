# PsyCalc LLM Wiki site

Static GitHub Pages site for the PsyCalc LLM Wiki.

URL after Pages deployment: <https://psycalc.github.io/>

Source wiki: <https://github.com/psycalc/psycalc-wiki>

## Local preview

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>.

## Notes

- Dependency-free static HTML/CSS/JS.
- Visualizations are generated in `assets/site.js`.
- Future improvement: generate graph data automatically from `psycalc-wiki/wiki/**/*.md` wikilinks.
