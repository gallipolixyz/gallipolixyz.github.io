# From One Mutation to a Full Service Outage: A GraphQL DoS Story

*Sometimes the most dangerous vulnerabilities do not leak any data.*

They do not expose sensitive information. 

They do not reveal internal services. 

But a single request can make the entire application completely unusable.

In this post, I will explain how a simple GraphQL feature turned into a full application-level Denial of Service attack.

![GraphQL DoS Story](/blogs/img/a-graphql-dos-story/1.png)

---

## It Started With a Normal Batch Feature

The target application had a feature where users could create batches from a single shipment. 

On the backend, this was handled with a GraphQL mutation. 

In a simplified form, it looked like this:

```graphql
mutation CreateBatch {
  createBatch(
    warehouseId: "WAREHOUSE_ID",
    presetId: "PRESET_ID"
  ) {
    id
  }
}
```

Normally, the expected behavior was simple:

- One mutation call creates one batch
- Rate limiting works per request
- Abuse looks difficult

From the outside, it looked like a safe design.

---

## The Turning Point: GraphQL Aliases

GraphQL has a powerful but often overlooked feature called aliases. 

This allows the same mutation to be executed multiple times inside a single request. 

For example:

```graphql
mutation CreateBatch {
  a1: createBatch(...) { id }
  a2: createBatch(...) { id }
  a3: createBatch(...) { id }
}
```

Here, there are three different aliases, but all of them execute the same operation. 

And the critical detail was this:

Rate limiting only counted HTTP requests. 

Not the number of mutations inside a request.

This meant a single request could trigger hundreds of operations.

---

## A Simple but Destructive Payload

I increased the number of aliases to grow the payload. 

The real structure looked like this:

```graphql
mutation CreateBatch {
  a1: createBatch(...) { id }
  a2: createBatch(...) { id }
  ...
  a175: createBatch(...) { id }
}
```

Inside one HTTP request: 

175 separate batch creation operations.

---

## Seeing the Impact Clearly

As I increased the alias count, I measured the server response time. 

The results were clear:

| Alias Count | Response Time |
|-------------|---------------|
| 1           | ~5.5 seconds  |
| 15          | ~13.5 seconds |
| 78          | ~58 seconds   |
| 175         | ~117 seconds  |

As the alias count increased, the server consumed much more resources. 

This clearly showed that each mutation was a real and heavy operation.

---

## Taking the Service Down With Parallel Requests

Even a single heavy request was enough to stress the system. 

But the real impact came when sending requests in parallel.

I sent 75 parallel HTTP requests. 

Each one contained 175 aliases.

In total: 

13,125 batch operations were triggered at the same time.

Within a short time, the application completely stopped responding. 

When I tried to access the site from the browser, I received:

Cloudflare 524 timeout errors. 

I tested from different networks and devices. 

The result was always the same. 

The entire platform was offline.

![Cloudflare 524 Timeout](/blogs/img/a-graphql-dos-story/2.png)

---

## What Was Actually Happening Behind the Scenes?

The root cause was simple:

- There was no limit on alias count
- Mutation cost was not calculated
- Rate limiting was only request-based
- Each operation was processed synchronously

As a result:

One request triggered hundreds of heavy operations

Parallel requests filled the thread pool

The application completely locked up

This was not a network-level attack. 

It was a pure application-level DoS.

![Application Level DoS](/blogs/img/a-graphql-dos-story/3.png)

---

## How Was It Fixed?

The customer solved the issue in a clean and effective way. 

Each alias call is now counted as a separate operation. 

This means:

- Rate limiting is applied per alias
- Running hundreds of mutations in a single request is no longer possible

This way, GraphQL flexibility is preserved while the application-level DoS risk is removed.

---

## Why Is This Bug Important?

This was not:

- A small performance slowdown
- A temporary lag

It resulted in the entire platform going offline. 

And it could be easily repeated.

---

## Lessons Learned

This case once again showed me that:

- GraphQL is very powerful, but it can be dangerous if not properly limited.
- Limiting only the number of requests is not enough.
- You must also control how many operations are executed inside each request.
- Alias count, query complexity, and cost-based controls are critical.

And most importantly: 

application-level DoS is often underestimated. 

But its impact can be more damaging than many data leaks.