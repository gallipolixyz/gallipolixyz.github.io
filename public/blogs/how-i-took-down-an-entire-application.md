# How I Took Down an Entire Application Using google.com and Earned a $2,000 Bounty

*Sometimes the most interesting vulnerabilities are not the ones that leak sensitive data.*

Sometimes the biggest impact comes from bugs that reveal no internal services, return no useful information and look almost impossible to exploit at first glance.

This is the story of one of those findings.

I had a Blind SSRF. 

No data extraction. 

No internal network access. 

No metadata endpoints.

![SSRF Blog Cover](/blogs/img/how-i-took-down-an-entire-application/1.png)

But I had one thing: 

> google.com

Yes, you read that right. 

To exploit this bug, I used nothing more than port 28 on google.com.

The result was simple and brutal. The entire application froze. 

With a bit of parallel traffic, I could keep it down as long as I wanted. 

And this unexpected impact earned me a clean two thousand dollars.

![Bounty](/blogs/img/how-i-took-down-an-entire-application/2.png)

---

## When I Realized How the Application Worked

The target system had an integration endpoint. 

A user supplied a URL and the backend made a request to that URL for validation. 

A classic SSRF surface, but usually this story ends like this:

- Internal IPs blocked
- CIDR ranges filtered
- localhost denied
- Private networks denied
- Metadata access prevented
- Blind SSRF with no meaningful responses

It is exactly the kind of surface that many people give up on. 

But instead of approaching this endpoint with the usual internal network mindset, I wanted to exploit it from a completely different angle.

---

## This Is Where the Story Changes

The critical moment for me was this:

If the endpoint can send outbound requests, then even if it cannot reach the internal network, it can still send requests to any external host. 

Which means the entire internet is a playground, including millions of hosts and thousands of non-responsive ports.

I did not know what HTTP library the server used, but most likely it looked like this:

```python
requests.get(url)
```

No timeout. 

A synchronous worker being blocked. 

A closed port triggering a connection timeout.

So in reality, accessing the internal network did not matter at all. 

Even a closed port on a public domain like Google was enough to create impact. 

So I tried it.

---

## Payload: google.com:28

**Normal Request (expected behavior):**

```http
POST /integration HTTP/1.1
Host: target.app
Content-Type: application/json

{
  "destinationUrl": "https://integration-url.com"
}
```

**Response:**

```http
HTTP/1.1 200 OK

{
  "status": "ok",
  "latency": "120 ms"
}
```

This is what the endpoint normally looked like. 

Fast. Stable. Predictable.

---

Then I made a simple change: 

`https://google.com:28`

No tricks. 

No bypasses. 

Just a different port on a public domain.

**Modified request:**

```http
POST /integration HTTP/1.1
Host: target.app
Content-Type: application/json

{
  "destinationUrl": "https://google.com:28"
}
```

**Response:**

```http
HTTP/1.1 500 Internal Server Error

{
  "error": "Connection to google.com:28 timed out",
  "latency": "30000 ms"
}
```

Instead of returning instantly, the request just hung there. 

Seconds passed. Nothing happened. 

That was the moment I realized the backend worker was completely blocked.

If one request stalled this badly, what would happen with a hundred? 

The answer was obvious. 

The application would die.

---

## Turbo Intruder Enters the Scene

I opened Burp. 

I queued the request 100 times in parallel. 

Then I switched to my browser and tried to open the main application.

Nothing loaded. 

I refreshed. 

Tried again. 

Tried from another device. 

Tried from another network.

The application was completely gone.

![Application Down](/blogs/img/how-i-took-down-an-entire-application/3.png)

Of course, once the attack stopped, everything returned to normal. 

But if you wanted, you could keep the system down indefinitely. 

The architecture simply could not defend itself against this pattern.

---

## What Was Actually Happening Under the Hood

Most people think of SSRF as internal network discovery. 

But the root cause here was much simpler:

- The backend is synchronous
- Libraries like `requests` do not use a default timeout
- A closed port causes long connection attempts
- Each request blocks a thread
- A hundred requests block a hundred threads
- Once the thread pool fills up, the entire application stops responding

This is true application-level DoS. 

Not user-specific DoS 

A complete application outage. 

Which clearly qualifies as high impact under most bounty programs.

Below is a simplified view of what is happening under the hood.

**Vulnerable Backend Logic**

![Vulnerable Backend Logic](/blogs/img/how-i-took-down-an-entire-application/4.png)

**Simplified worker model**

![Simplified Worker Model](/blogs/img/how-i-took-down-an-entire-application/5.png)

**Attacker side parallel request logic**

![Parallel Request Logic](/blogs/img/how-i-took-down-an-entire-application/6.png)

---

## Conclusion: SSRF Is Not Always About Data Extraction

This finding taught me that:

- SSRF is not only about internal network scanning
- Even Blind SSRF can create serious impact
- An external host like google.com can be enough to exploit a vulnerability

The simplicity and effectiveness of this bug made it one of the most satisfying findings I have had. 

And for it, I earned two thousand dollars.