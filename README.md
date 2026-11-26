<picture>
  <source media="(prefers-color-scheme: dark)" srcset="readme/hero-dark.svg">
  <img src="readme/hero-light.svg" alt="myelin" width="880">
</picture>

# myelin

A minimal language and protocol for running local models. Omyelin is the app around it.

Working name. In development, not published yet.

Myelin compiles a model into one native program for the machine it runs on. Omyelin pulls, runs and serves models on top of it.

Measured: 1.55× prompt processing at q8 against llama.cpp's default AMX build. SmolLM2-360M-Instruct, x86 box, 8 threads, median of 7 rounds. Your machine and model will differ.

## logos

SVG and 2048 px PNG marks are in [`logos/`](logos/). The pack is stored as text in [`pack/`](pack/) and restored to `logos/myelin-logos.zip` by the Pages workflow.

## this repository

Static site, published with GitHub Pages through the workflow in `.github/workflows/pages.yml`. Source is `index.html`, `styles.css`, `main.js` and `logos/`. Asset paths are relative, so it works under any subpath.

By Teodor Walter Vido, 2026.
