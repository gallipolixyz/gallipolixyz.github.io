# Web Cache Deception Vulnerability

//TO DO : original https://k4d1r.medium.com/web-cache-deception-c992a3042659

## TL;DR

We will address the Web Cache Deception vulnerability, which is caused by the misconfiguration of caching mechanisms and may lead to the disclosure of users’ private data.

## What is the caching mechanism? How does it work?

To understand Web Cache Deception, we first need to know about Caching and Cache mechanisms. Let’s briefly talk about caching;

First of all, when we look at the meaning of caching in computer terminology, it is the technique of saving frequently used data. If we expand the concept a little more, caching gives us access to the source of the data instead of providing direct access to the source of the data. Thus, we save time during data transfer and eliminate the problem of processing intensity in the main source. CDN (Content Delivery Network), Reverse Proxy, Load Balancer products are actively used in caching mechanisms.

![No Caching](/public/blogs/img/web-cache-deception/no-caching.png)
//TO DO : Add alt text for images?
![Caching](/public/blogs/img/web-cache-deception/caching.png)
//TO DO : Add alt text for images?
It contains an example scenario for the use of the 2 visual caching mechanisms I prepared above. While the user accesses the data in a shorter time, the application server does not become a bottleneck. When you look at major systems (Google, Facebook, Yahoo, PayPal …) you can see that most of them use the caching mechanism.

## Let’s understand the vulnerability

Let’s consider a website that uses a cache mechanism. The first request made by the user to this website will be as follows;

![Retrieving data from application server because user’s request is not cached in cache server](/public/blogs/img/web-cache-deception/retrive-cache.png)
//TO DO : Add alt text for images?

After that, requests to be made for <http://www.x.com/file.css> will return directly from the cache server, since the cache server hosts the relevant file thanks to the cache mechanism;

![Retrieving data from cache server because user’s request is cached ](/public/blogs/img/web-cache-deception/retrive-no-cache.png)
//TO DO : Add alt text for images?

At this point, let’s consider a web application that has sensitive data and uses a cache mechanism. You have accessed and logged in here with the address <https://bank.com/account.php>. From this point on, if the headers and cache mechanism are not configured correctly, your request to a static resource (<https://bank.com/account.php/evil.css>) may be cached on the cache server and this may cause information disclosure. If we explain visually;

![https://www.darkreading.com/risk/deconstructing-web-cache-deception-attacks-they-re-bad-now-what-](/public/blogs/img/web-cache-deception/wcd.png)
//TO DO : Add alt text for images?

Let’s Test the Vulnerability, PoC
In our example scenario, we will model PayPal, one of the first places where our vulnerability was found. After a user logs in, they will see the amount of money in their account, so we have a page with user-specific data and a misconfigured cache mechanism. Here are the steps:

- User logs in
- There is a page showing the amount of money in the account
- Malicious hacker knows the victim is logged in and redirects it to a static resource
- Our victim visit the page and now the page with sensitive data (if the cache mechanism is configured incorrectly) is cached
- Malicious hacker get sensitive data

![User Login](/public/blogs/img/web-cache-deception/user-login.png)
//TO DO : Add alt text for images?

![A user-specific page that informs the amount of bank account](/public/blogs/img/web-cache-deception/user-specific.png)
//TO DO : Add alt text for images?

![The request made to /nonexist.css (static resource) by methods such as social engineering, phishing, as a result (if the cache server is configured incorrectly) caching localhost://account.php/nonexist.css on the cache server](/public/blogs/img/web-cache-deception/leaked.png)
//TO DO : Add alt text for images?

![Incognito tab, leaked amount of bank account!](/public/blogs/img/web-cache-deception/leaked2.png)
//TO DO : Add alt text for images?

Hope it was helpful, Best regards!

Finally, if you want to examine real-case scenarios, [1](https://hackerone.com/reports/439021), [2](https://hackerone.com/reports/397508), and [Black Hat presentation](https://blackhat.com/docs/us-17/wednesday/us-17-Gil-Web-Cache-Deception-Attack.pdf)

If you’re interested in discussing these techniques or collaborating on similar research, feel free to join our community on Telegram: [https://t.me/gallipolixyz](https://t.me/gallipolixyz)

[About the Author](https://www.linkedin.com/in/kadirarslan1/)

Kadir is a Security Engineer. He has professional experience in security engineering working with Fortune 500.
