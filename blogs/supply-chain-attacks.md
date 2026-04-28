# Supply chain attacks on software dependencies

A supply chain attack happens when attackers compromise a dependency, package, or tool you trust.
Attackers infiltrate a vendor or component before it reaches you, so the compromise is already baked in.

![Supply chain diagram](/blogs/img/supply-chain/supply-chain.png)
---

## How does it work?
You install a normal dependency:

```
npm install axios
```


But one of its dependencies (or the package itself) was tampered with. Now during install or runtime, it can:

- execute hidden scripts  
- download malware  
- steal secrets  

And your app will still work. 

---

## Where is the risk?

The supply chain is the whole pipeline:

- design  
- development  
- distribution  
- updates  
- deployment  
- maintenance  

At *any* step, something can be injected. Maliciously or by mistake.

---

## Common ways attackers pull this off

### 1. Hijacking updates

Compromise the vendor and push a malicious update.

### 2. Compromising open-source dependencies

Classic move:

- upload a malicious package  
- make it look legit (or typo it)  
- wait for developers to install it  

Example: fake Python packages like `djago`, `diango`, etc., mimicking Django.

Same functionality, plus a backdoor.

---

## Real example: Axios npm compromise (2026)

A recent case involved the popular npm package Axios.

- Malicious versions (`1.14.1`, `0.30.4`) were published
- No visible change to the main code
- Instead, a **hidden dependency** was added

That dependency:

- ran automatically during `npm install`
- executed a `postinstall` script
- connected to a command-and-control server
- downloaded a **remote access trojan (RAT)**

Cross-platform impact:

- macOS → dropped native binary  
- Windows → PowerShell RAT with persistence  
- Linux → Python loader  

Even worse:

- triggered in **CI/CD pipelines**
- persisted across reboots
- removed traces to look clean after install

Attribution points to a North Korean state-sponsored group (Sapphire Sleet).

[Source](https://www.microsoft.com/en-us/security/blog/2026/04/01/mitigating-the-axios-npm-supply-chain-compromise/)

---

## Why these attacks are so effective

### 1. Privileged access

Dependencies and tools often run with high permissions.

- build systems  
- package managers  
- CI/CD  

### 2. Trusted communication

Software constantly talks to vendors:

- updates  
- patches  
- telemetry  

Attackers abuse that channel.

---

## How to avoid it

### 1. Stop auto-updating blindly

This is non-negotiable.

Instead of:

```json
"axios": "^1.14.0"
```

Use:

```json
"axios": "1.14.0"
```

You upgrade manually. Not npm.

### 2. Be suspicious of install-time scripts

Anything that runs during install is a risk.

- `postinstall`
- `preinstall`

If possible:

```
npm ci --ignore-scripts
```

### 3. Treat vendors as part of your threat model

You don’t control them, but they can compromise you.

Basic due diligence:

- how do they handle vulnerabilities?  
- do they provide patches?  
- do they publish component inventories?  

### 4. Reduce blast radius

Assume something will get through.

- limit privileges  
- monitor outbound traffic  

If a dependency suddenly talks to a random server, you should catch it.

---

## Final note

Supply chain attacks dont break systems, they become part of them. 

---

## About the author

Matjaz Madon, MSc Computer Science, BSc Math. Interested in AI and Cybersecurity. 

[Connect on LinkedIn](https://www.linkedin.com/in/matjazmadon)