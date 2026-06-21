# Bible Baptist Church Alicia — Website

A fast, classic, low-maintenance **static website** for Bible Baptist Church Alicia
(Pasil, Poblacion, Alicia, Bohol, Philippines). Pure HTML + CSS with one small
vanilla-JS contact form — no framework, no build step. Hosted on **AWS Amplify**,
domain via **Route 53**. Built to be handed off to the church.

> Structure and deploy pipeline mirror the `reachthephilippines` site (reference only);
> the look, content, and brand are Bible Baptist Church Alicia's own.

## Structure

```
bbc-alicia/
├── amplify.yml          # Amplify build config — publishes website/ (no build step)
├── .gitignore
├── README.md
├── source-photos/       # original full-res photos (NOT published; kept for re-editing)
└── website/             # ← Amplify publish root
    ├── index.html       # Home
    ├── 404.html
    ├── about/           # Our story · pastor · history · what we believe
    ├── ministries/      # Sunday School, music, youth, ladies, basketball, outreach
    ├── watch/           # YouTube live + recent messages
    ├── visit/           # Visit & Contact — map, schedule, Formspree form
    └── assets/
        ├── css/site.css         # maroon/gold/cream design system
        ├── js/contact.js        # Formspree contact handler
        └── img/                 # logo, favicon, hero, gallery photos
```

## Local preview

```bash
cd website
python3 -m http.server 8000
# open http://localhost:8000
```

## Key facts baked into the site

- **Services:** Sunday School 9:00 AM · Worship 11:00 AM · Wednesday Prayer 7:00 PM
- **Address:** Pasil, Poblacion, Alicia, Bohol 6314, Philippines
- **Pastor:** Pastor Dodong Curit
- **Phone:** +63 920 177 7434 · **Email:** debogz4ever@gmail.com
- **Facebook:** facebook.com/bbcalicia · **YouTube:** @BibleBaptistChurchAlicia
  (channel ID `UCTSj4OIcBwv-HLB2WyXkr1w` — used for the live + uploads embeds)
- **Brand:** maroon `#6e1620` + amber-gold `#c8941c` + warm cream, from the BBCA logo

## Before launch — TODO

1. **Contact form (Formspree):** create a free form at https://formspree.io delivering
   to `debogz4ever@gmail.com`, then paste its endpoint into `website/assets/js/contact.js`
   (replace `REPLACE_WITH_FORM_ID`). Until then the form politely asks visitors to email.
2. **Map pin:** `website/visit/index.html` uses the Alicia town-center coordinates
   (Plus Code VCWR+V5V). Replace with the exact building pin when confirmed.
3. **Content to add/confirm with the church** (marked with `TODO` comments in the HTML):
   pastor's full name + bio, exact founding year/history, full ministries list, and
   the church's **own Statement of Faith** — deliberately omitted for now. The About
   page shows only the church's own self-description; do not add doctrine until the
   church provides their articles of faith.
4. **Photos:** swap/add any images in `website/assets/img/` and `…/img/gallery/`.

## Deploy (AWS Amplify + Route 53)

1. Push this repo to GitHub org **FaithfulAudio** (`bbc-alicia`).
2. AWS Amplify → **New app → Host web app** → connect the GitHub repo, branch `main`.
   Amplify reads `amplify.yml` and publishes `website/` (no build).
3. Register **bbc-alicia.org** in Route 53 → Amplify **Domain management** → add the
   apex + `www`. Amplify provisions the SSL cert and writes the records into the
   Route 53 hosted zone. Verify HTTPS and the `www` → apex redirect.

## Handoff to the church

Transfer ownership of: the GitHub repo, the Amplify app, the Route 53 domain, and the
Formspree form. All content is plain HTML — edits are simple text changes, no build required.
