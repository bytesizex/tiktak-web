# TikTak public website

Static site for the TikTok app submission: official website URL, Terms of Service and Privacy Policy.
No build step, no JavaScript, no dependencies — three HTML files and one stylesheet.

```
website/
  index.html      home page (what it does, how it works, platforms, FAQ)
  terms.html      Terms of Service
  privacy.html    Privacy Policy
  styles.css      shared styles
  contact.js      "Contact us" buttons — address never appears in the HTML
```

The contact address is stored XOR-masked and base64-encoded inside `contact.js` and is only
decoded when a visitor clicks a "Contact us" button, which opens their mail client directly.
No `mailto:` link or address string is present in the served HTML, so address harvesters find
nothing; without JavaScript the button does nothing. To change the address, re-encode it in
`contact.js` rather than pasting it into the HTML.

## 1. Fill in the placeholders

TikTok reviewers reject pages with leftover placeholders, so replace all of these before publishing:

| Placeholder | Meaning | Example |
| --- | --- | --- |
| `[[OPERATOR_NAME]]` | Your name or company that runs the app | `Elton Rivera` |
| `[[CONTACT_EMAIL]]` | A mailbox you actually read | `hello@yourdomain.com` |
| `[[EFFECTIVE_DATE]]` | Today's date on the legal pages | `November 6, 2026` |
| `[[EFFECTIVE_YEAR]]` | Copyright year | `2026` |
| `[[JURISDICTION]]` | Country/state whose law governs the Terms | `the State of California, USA` |

One command does all of it (run from this directory):

```sh
OPERATOR="Your Name" EMAIL="you@yourdomain.com" JURISDICTION="the State of California, USA" \
  sh -c 'for f in *.html; do
    sed -i "" \
      -e "s/\[\[OPERATOR_NAME\]\]/$OPERATOR/g" \
      -e "s/\[\[CONTACT_EMAIL\]\]/$EMAIL/g" \
      -e "s/\[\[EFFECTIVE_DATE\]\]/$(date +"%B %-d, %Y")/g" \
      -e "s/\[\[EFFECTIVE_YEAR\]\]/$(date +%Y)/g" \
      -e "s/\[\[JURISDICTION\]\]/$JURISDICTION/g" "$f"
  done'
```

(macOS `sed` needs the empty `-i ""`; on Linux use `-i` alone.)

Check nothing is left: `grep -rn "\[\[" *.html` should print nothing.

## 2. Host it

TikTok requires a public HTTPS site on a domain or subdomain you control, and it must be a real
site — their guidelines explicitly reject landing pages, login pages and pages still under
construction. Any static host works; all of them give HTTPS for free:

- **Cloudflare Pages / Netlify / Vercel** — drag this folder into their dashboard, or connect a repo.
- **GitHub Pages** — push the folder and enable Pages for the branch.
- **Your own server** — copy the folder behind nginx/Caddy and serve it over TLS.

A `*.netlify.app` or `*.pages.dev` address is fine for hosting, but URL verification in the next
step is easier with a domain you own (a ~$10/year `.com` is enough).

## 3. Verify the URLs in the TikTok developer portal

Content Posting API apps must pass URL property verification before review:

1. App page → **URL properties** → **Verify properties** (do it in Production mode).
2. Verify by **Domain** (e.g. `tiktak.example.com`) or by **URL prefix** (e.g. `https://tiktak.example.com/`).
3. TikTok shows a verification file or DNS/meta challenge — put it where they ask. If it is a file,
   drop it next to `index.html` and redeploy, then press verify.

Until verification passes, the Content Posting API stays limited even with a working token.

## 4. Enter in the portal

- **Website URL** — the home page, e.g. `https://tiktak.example.com/`
- **Terms of Service URL** — `https://tiktak.example.com/terms.html`
- **Privacy Policy URL** — `https://tiktak.example.com/privacy.html`

Both legal links are already in the header *and* the footer of every page, visible without
opening a menu, which is what their guidelines ask for.

## 5. Wording that matters at review

The copy intentionally states the facts a reviewer checks:

- the app publishes only content the user created and authorised;
- it uses the official TikTok Content Posting API with `video.publish` and `video.upload`;
- tokens and videos are stored locally, not on a server;
- content is not sold or shared with advertisers;
- automated spam and fake engagement are prohibited;
- the app is not affiliated with TikTok, Google or Meta.

If any of that stops being true (for example you add server-side storage), update
`privacy.html` accordingly before submitting — a policy that contradicts the app is a common
rejection reason.

## Local preview

```sh
python3 -m http.server 8090 --directory website
```

Then open <http://127.0.0.1:8090/>.
