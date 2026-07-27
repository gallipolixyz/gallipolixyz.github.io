# Browser Extension Supply Chain Attacks

Browser extensions seem small and harmless. They block ads, check your grammar, or add useful features to your browser. But many of them have permission to read the websites you visit, access your cookies, and sometimes even see what you type.

![Browser extension diagram](/blogs/img/browser-extension/browser-extension.png)

---

## Why extensions are such a good target

Installing an extension means placing trust in three things at once:

- the developer who wrote it
- the Chrome Web Store or Firefox Add-ons review process
- every update that developer ever pushes, forever

That's a long chain, and extensions get privileges most websites can only dream of:

- **Broad host permissions (`<all_urls>`)** — reading and modifying pages on your bank, your inbox, your company's internal tools
- **Cookie and storage access** — session tokens, auth state,...
- **Network interception** — injecting scripts, exfiltrating data
- **Background scripts** — running even when you're nowhere near the tab


---

## How these attacks actually happen

### 1. Developer account takeover

Nothing is wrong with the extension itself. What's compromised is the developer's account — a phished password, a reused credential, no MFA on the store login.

The attacker ships a new version under the same name, same icon, same five-year-old five-star reviews. Auto-update does the rest. This is by far the most common pattern in real-world incidents.

### 2. Quiet ownership changes

Sometimes a developer builds something genuinely useful, gathers a big user base, and then sells it — sometimes for a surprisingly small sum.

The buyer's first update adds ad injection, affiliate hijacking, or quiet data collection. Everyone who installed the original extension is now running someone else's code.

### 3. Typosquatting and lookalikes

The same trick that works on npm works here too:

- `AdBlock` vs. `AdBlok`
- fake wallet extensions dressed up as MetaMask or Phantom
- "PDF converter" tools that exist purely to harvest credentials

They clone the icon, get close enough on the name, and buy enough fake reviews to rank.

### 4. Compromised open-source maintainers

Plenty of extensions are open source, which sounds like a safeguard — until a malicious pull request slips in through a dependency bump or a minified build artifact that nobody actually reads line by line.

### 5. Build pipeline compromise

Even a careful, honest developer can get burned here. If someone steals the CI credentials or npm tokens used to build the extension, they can inject code at build time. GitHub shows clean source. The `.crx` file that actually ships does not.

---

## What this looks like in practice

These aren't hypotheticals — they're patterns that show up again and again in incident reports:

**Cookie theft.** A quiet update adds a background script that reads cookies on a handful of target domains and phones the data home. Nothing visibly changes on screen.

**Affiliate hijacking.** The extension starts rewriting links on shopping sites to slot in the attacker's referral code. It's theft of revenue rather than data, but it's still a supply chain compromise.

**Crypto wallet drainers.** A wallet extension keeps its normal interface intact while quietly swapping recipient addresses or shipping out seed phrases in the background.

**Enterprise creep.** An employee installs something small and useful — a tab manager, a meeting-notes tool, a grammar checker — and months later it has a path into SaaS admin panels, source repos, or internal wikis.

---

## Auto-update: the double-edged sword

Browsers update extensions automatically, and most of the time that's a good thing — it patches real vulnerabilities fast. But it also means an attacker only needs one successful publish, and the rest happens on its own.

Almost nobody:

- reads changelogs
- notices when permissions change (stores often skip re-prompting if the permission set stays technically the same)
- questions whether the extension they installed three years ago is still running the same code

A compromised update can sit there for weeks before anyone catches it.

---

## The permission problem

Extensions ask for permission once, at install. The trouble is how blunt that permission usually is:

```
"Read and change all your data on all websites"
```

One line, and it covers your bank, your email, and your company's internal dashboard all at once.

Store review has gotten stricter over the years, but:

- broad permissions remain completely normal for legitimate tools
- permissions rarely get scaled back, and occasionally creep upward in an update
- minified, obfuscated code is genuinely hard to audit at store scale

Nobody is really reading the code — not you, and not the store's automated review either.

---

## How to actually reduce the risk

### Treat extensions like production dependencies

The npm mindset applies directly here:

- install fewer of them
- stick to well-maintained tools from sources you trust
- be suspicious of anything asking for `<all_urls>` when a narrower host list would clearly do

If you wouldn't hand a random npm package root access to your CI pipeline, don't hand a random extension access to every tab you open.

### Keep an eye on updates where you can

Chrome Enterprise and managed browser policies let organizations block auto-update on specific extensions or restrict installs to an allowlist.

For personal use, it's worth doing a periodic clean-out: check what's actually installed, and remove anything you don't recognize or haven't touched in months.

### Watch for ownership changes

Before installing something popular, it's worth a quick check:

- when was it last updated?
- do recent reviews mention anything odd?
- did the GitHub repo go quiet while store updates kept shipping — or did it recently change hands?

A sudden jump in requested permissions, or a new publisher name, is worth pausing on.

### Keep high-risk browsing separate

Run a dedicated browser profile — zero extensions — for banking, admin panels, and production access.

Your everyday browser with fifteen extensions installed doesn't need to be the same one you use to manage AWS or approve a wire transfer.

### Watch outbound traffic

For security teams, endpoint and network monitoring can catch an extension phoning home to a new domain right after an update. A grammar checker has no business suddenly talking to a server in another country.

### Allowlist at the org level

Extensions deserve a place in the software inventory, not an exception from it:

- allowlist approved extensions only
- block `<all_urls>` unless there's a real reason for it
- use MDM or browser management to shut down sideloading

---

## What the stores are — and aren't — catching

Chrome, Firefox, and Edge all require some combination of developer verification, code review, and Manifest V3 constraints. That catches a lot of outright malware.

It catches much less of:

- a legitimate account that's been quietly taken over
- an extension that only turns malicious after a delay, or only for a subset of users
- exfiltration disguised as ordinary analytics traffic

The store is a gate. It was never a guarantee.

---

## The bottom line

A browser extension supply chain attack rarely looks like a hack. The icon hasn't changed. The name hasn't changed. The update just installed itself overnight, and nothing on the surface gives it away.

Install less. Keep your high-trust browsing separate. And remember that any extension you didn't write yourself is software that can change without asking you first — because it can.

---

## About the author

Matjaz Madon, MSc Computer Science, BSc Math. Interested in AI and Cybersecurity.

[Connect on LinkedIn](https://www.linkedin.com/in/matjazmadon)
