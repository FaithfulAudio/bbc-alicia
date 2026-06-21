# Bible Baptist Church Alicia — Website

A fast, classic, low-maintenance **static website** for Bible Baptist Church Alicia
(Pasil, Poblacion, Alicia, Bohol, Philippines). Pure HTML + CSS, plus one small
vanilla-JS contact form backed by Amazon SES. No framework, no build step.
Hosted on **AWS Amplify**, domain + DNS via **Route 53**.

> Structure and deploy pipeline mirror the `reachthephilippines` site (reference only);
> the look, content, and brand are Bible Baptist Church Alicia's own.

## Live

- **Site:** https://bbc-alicia.org  (and https://main.dx0zjjm59ozhh.amplifyapp.com)
- Every push to `main` on GitHub auto-builds and deploys via Amplify.

## Structure

```
bbc-alicia/
├── amplify.yml          # Amplify build config — publishes website/ (no build step)
├── README.md
├── server/
│   └── contact-form/    # Python Lambda (API Gateway → SES) for the /visit/ form
├── source-photos/       # original full-res photos (NOT published; kept for re-editing)
└── website/             # ← Amplify publish root
    ├── index.html       # Home
    ├── 404.html
    ├── about/           # our story · pastor · history · "who we are" (their own words)
    ├── ministries/      # music, young people, men's & ladies meetings, basketball, soulwinning
    ├── watch/           # YouTube live + recent (link-out cards — no empty players)
    ├── visit/           # Visit & Contact — map, schedule, SES contact form
    └── assets/
        ├── css/site.css         # maroon/gold/cream design system
        ├── js/contact.js        # SES contact handler (posts to API Gateway)
        └── img/                 # logo, favicon, hero, gallery photos
```

## Local preview

```bash
cd website && python3 -m http.server 8000   # open http://localhost:8000
```

## Key facts baked into the site

- **Services:** Sunday School 9:00 AM · Worship 11:00 AM · Wednesday Prayer 7:00 PM
- **Address:** Pasil, Poblacion, Alicia, Bohol 6314, Philippines
- **Pastor:** Pastor Dodong Curit
- **Phone:** +63 920 177 7434 · **Email:** debogz4ever@gmail.com
- **Facebook:** facebook.com/bbcalicia · **YouTube:** @BibleBaptistChurchAlicia
  (channel ID `UCTSj4OIcBwv-HLB2WyXkr1w`)
- **Brand:** maroon `#6e1620` + amber-gold `#c8941c` + warm cream, from the BBCA logo

## Deployed AWS resources (account 137159919870, us-east-1)

| Thing | Value |
|---|---|
| GitHub repo | github.com/FaithfulAudio/bbc-alicia |
| Amplify app id | `dx0zjjm59ozhh` (branch `main`, auto-build) |
| Domain | `bbc-alicia.org` (Route 53, auto-renew, WHOIS privacy) · hosted zone `Z08248912VRLZLWN5FUAT` |
| Contact API | `https://tdf5nyjj6g.execute-api.us-east-1.amazonaws.com/contact` |
| Lambda | `bbc-alicia-contact-form` (python3.12) · role `bbc-alicia-contact-form-role` |
| SES sender | `noreply@bbc-alicia.org` (domain DKIM-verified) → delivers to `debogz4ever@gmail.com` |

### Contact form (Amazon SES)
The `/visit/` form posts JSON to the API Gateway endpoint → Lambda
(`server/contact-form/lambda_function.py`) → SES, which emails the church inbox from
`noreply@bbc-alicia.org` (DKIM-signed) with the visitor's email as Reply-To. A hidden
honeypot field blocks bots. To change the recipient or sender, edit the Lambda's
`RECIPIENT` / `SENDER` environment variables. To redeploy the Lambda after editing:
```bash
cd server/contact-form && zip -j function.zip lambda_function.py
aws lambda update-function-code --function-name bbc-alicia-contact-form \
  --zip-file fileb://function.zip --region us-east-1
```

## Still to add (only when the church provides it)

Marked with `TODO` comments in the HTML — **do not invent any of this**:
- Pastor's full formal name + short bio; exact founding year / history.
- Any additional ministries.
- The church's **own Statement of Faith** — deliberately omitted. The About page shows
  only the church's own self-description; do not add doctrine until they provide it.

## Handoff to the church

Transfer ownership of: the GitHub repo (FaithfulAudio), the Amplify app, the Route 53
domain, and the SES/Lambda/API-Gateway resources. All page content is plain HTML — edits
are simple text changes that auto-deploy on push. No build step, no framework.
