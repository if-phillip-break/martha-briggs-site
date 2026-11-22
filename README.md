# Martha Briggs Educational Club website

The website of the Martha Briggs Educational Club, Inc. of New Bedford, Massachusetts. It's hosted on GitHub Pages.

**Club members updating the site: read [EDITING-GUIDE.md](EDITING-GUIDE.md).** Everyday changes go in [`_data/club.yml`](_data/club.yml).

## How it's built

GitHub Pages builds the site with Jekyll automatically on every commit to the default branch. There's no build step to run yourself.

| Path | Purpose |
| --- | --- |
| `_data/club.yml` | Editable content: contact details, scholarship details, membership, giving, events |
| `_layouts/default.html` | Page skeleton (head, header, footer) |
| `_includes/` | Header and phone menu, footer, Facebook link, application button |
| `*.html` (root) | One file per page (front matter plus page content) |
| `css/styles.css` | Base styles from the original design |
| `css/motion.css`, `js/motion.js` | Animations, figures and interactive pieces (all off for reduced-motion visitors) |
| `js/menu.js` | Full-screen phone menu |
| `images/`, `files/` | Pictures, and downloads such as the application PDF |
| `.pages.yml` | Optional form-based editor ([Pages CMS](https://pagescms.org)) for `_data/club.yml` |

Links are relative, so the site works both at `https://<user>.github.io/<repo>/` and on a custom domain.

## Preview locally (optional)

With Ruby and Jekyll installed: `jekyll serve`, then open http://localhost:4000.
