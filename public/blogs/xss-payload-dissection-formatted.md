Hi, Let's understand "XSS" payloads from "Bug Bounty Writeup: Reflected XSS via CVE-2025-0133 on PAN-OS" by "Thân Trung Tâm" and "CVE-2025–4406 Writeup: Stored XSS on wpForo Forum" by "Muhan luo"

We recommend you to be familiar with basics of these topics,

- How Browsers Parse HTML5
- XML Namespaces & Foreign Content
- The Document Object Model (DOM) Architecture
- Basic Cross-Site Scripting (XSS)

Optional: File Upload Vulnerabilities

## Lets begin with "Bug Bounty Writeup: Reflected XSS via CVE-2025-0133 on PAN-OS",

SVG XSS payload (`<svg xmlns="http://www.w3.org/2000/svg"><script>prompt("XSS")</script></svg>`) was used with a URL, For example :"https://vpn.[REDACTED].com/ssl-vpn/........." on an exposed VPN portal.

Target Location: *.[REDACTED].com
Target Category: Web App
VRT: Cross-Site Scripting (XSS) > Reflected > Non-Self
Priority: P3
Bug URL: https://vpn.[REDACTED].com/

This "could" result in modification, deletion, or theft of data, including accessing or deleting files, or stealing session cookies to hijack a user's session within a user's browser ( Testing with ethical boundaries, such actions are strictly prohibited).

![Diagram showing the CVE-2025-0133 payload flowing from attacker through a Palo Alto GlobalProtect portal to trigger an XSS alert in the victim's browser](images/palo-alto-xss-flow.png)

1. The most important element here is `<svg>` (Scalable Vector Graphics), When a security filter looks at raw user input, it scans for dangerous HTML patterns. However, when they see `<svg>`, they classify the entire block as inert graphical markup rather than active web content. They assume everything inside the graphics block consists of visual vectors (like lines and circles) and skip filtering the nested `<script>` tag. Instead of rendering it as graphic text, the browser treats it as a special "integration point" where the rules pop back to HTML behavior. The script immediately executes as active JavaScript.

2. After that comes the `xmlns="http://www.w3.org/2000/svg"` to create a dual-context payload, it works both as a standalone `.svg` file served with `Content-Type: image/svg+xml` (XML parser) and as an HTML fragment injected into a page (HTML5 parser). Omitting it would break the standalone-SVG case.

3. The `<script>` tag functions as an HTML integration point within SVG foreign-content mode, enabling JavaScript execution by reverting the parser to HTML-like behavior. This payload works across both inline HTML5 parsing and standalone SVG-as-XML parsing, often bypassing server-side sanitizers.

4. The others: The use of `prompt("XSS")` serves as a visual indicator of script execution, offering distinct technical advantages over `alert()` and `">`, `</script>` & `</svg>` are closing of the script.

**What this payload cannot do on its own:** If the SVG is loaded via `<img src="...">`, `<embed>`, or CSS `background-image`, the browser disables script execution inside the SVG rendering context — Execution only triggers if the payload is printed inline (bleeding directly into the host page's DOM) or loaded directly as a top-level document (e.g: a user navigates directly to https://example.com)

## Now, Let's move to "CVE-2025–4406 Writeup: Stored XSS on wpForo Forum",

The below payload was used while testing wpForum, which demonstrates that "A user can upload an SVG file containing malicious Javascript because the sanitization was improperly implemented" and let's take a look on the script.

```xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <a xlink:href="javascript:alert('XSS')">
    <circle r="45" cx="100" cy="100" fill="red" />
  </a>
</svg>
```

This payload is Stored XSS technique known as a XLink Navigation Attack. Also, This payload contains some elements of "Bug Bounty Writeup: Reflected XSS via CVE-2025-0133 on PAN-OS" such as `<svg>` and `xmlns="http://www.w3.org/2000/svg"`.

1. First we have `xlink:href` ( The Evasion Strategy ), Many custom filters use basic regular expressions or lookup lists to scan inputs for the string href= "JavaScript....." is dangerous, so they block it and prefix-less href attribute is technically invalid on an anchor (`<a>`) tag. Hence, `xlink:href` is used here. Having a completely different name and identity in the DOM structure, The filter assumes the attribute is benign custom markup and allows it through, while the browser processes it as a valid hyperlink.

![Split diagram contrasting how an automated security filter perceives the SVG payload as inert graphics versus how the browser actually parses and renders it as a clickable XSS vector](images/filter-vs-browser-reality.png)

2. Unlike the previously analyzed inline `<script>` payload, this vector does not execute automatically upon page load. It relies on a chain of distinct browser mechanics to achieve execution:

   a. Active DOM Trees: The payload treats SVG as a first-class XML document. Rather than rendering a flat, unalterable raster graphic (like a .png), the browser constructs a live Document Object Model (DOM) tree for the SVG.

   b. The Click Target Area: An anchor tag (`<a>`) surrounding a shape tells the browser to map a hyperlink over that coordinate space. The nested `<circle>` element provides a concrete physical region for the user to interact with. Without a rendered visual shape inside the anchor tags, the clickable target area would shrink to zero, rendering the attack broken and unusable.

   c. The javascript: URI Context: When a user clicks the red circle, the browser evaluates the destination URI scheme. Because the scheme is explicitly set to javascript:, the browser halts standard web navigation and directly executes the remaining string (`alert('XSS')`) as immediate code within the origin context of the current hosting page.

3. The "Others":

   a. `xmlns="http://www.w3.org/2000/svg"`: This establishes the base SVG formatting framework. Without it, a standalone file is parsed as generic, plain XML text, and the browser will refuse to render shapes or wire up interactive anchor elements

   b. `xmlns:xlink="http://www.w3.org/1999/xlink"`: This explicitly registers the xlink prefix and maps it to the official W3C XML Linking standard. This registration tells the browser how to interpret the properties of xlink:href. If this line is missing, the file triggers a namespace structural error, forcing the XML parser to drop or ignore the underlying hyperlink altogether.

**What this payload cannot do on its own:** It requires user interaction (a click on the circle). It is **not** a drive-by payload — it will not execute if the SVG is loaded via `<img src="...">` (which sandboxes SVG into a non-scripting context) or if the browser's SVG parser strips `javascript:` URIs. It executes only when the SVG is rendered inline in the DOM, served directly as `image/svg+xml`, or opened as a standalone document, **and** the user clicks the shape.

## Common Principle in both payload

Both payloads use "SVG" to bypass the filter and Both vulnerabilities exist because the underlying software failed to properly clean or sanitize user-supplied data before rendering it in the browser. To prove the vulnerability worked, both researchers used standard, harmless JavaScript popup boxes—prompt("XSS") in the first article and alert('XSS') in the second—to visually demonstrate that the browser executed their injected code.
