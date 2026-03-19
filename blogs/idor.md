# Insecure Direct Object Reference (IDOR)

So here's the thing—IDOR isn't flashy. It's just… a missing check.

You change a number in a URL, hit enter, and suddenly you're looking at someone else's data. That's it. That's the bug.

![IDOR diagram](/blogs/img/idor/idor.png)


In simple terms, **Insecure Direct Object Reference** happens when an application exposes internal identifiers (like user IDs or file names) and doesn't verify whether the requester should actually have access.

It's basically the system saying:  
*"Oh, you asked for this? Sure, here you go."*  


Let's say your app has:

```
/account/42
```

Looks harmless.

But if I'm logged in as user 7 and I try:

```
/account/43
```

—and it works? That's IDOR. 


---

## Why this keeps slipping through

Honestly? Because it feels too obvious.

Developers think:

> "We already have login, so we're good."

> "It's just an internal ID."

> "No one's going to guess this."

That last one—yeah, people absolutely will. Or they'll automate it. Or accidentally stumble into it.


---

## How to avoid it

### 1. Always check who owns the data

Every single time. No exceptions.

Instead of blindly fetching:

```python
user = users.get(user_id)
```

Do something like:

```python
if current_user.id != user_id:
    return {"error": "Forbidden"}, 403
```

Or better—don't even rely on user input for this:

```python
user = get_current_user_data()
```

Less trust in the client = fewer problems. Simple.

### 2. Stop exposing predictable IDs

Sequential IDs (1, 2, 3…) are easy to guess. Too easy.

Switch to:

- UUIDs
- Randomized tokens
- Non-sequential identifiers

It won't fix bad authorization—but it makes casual probing harder. Think of it as friction, not a solution.

### 3. Keep authorization on the server

Frontend checks don't count. At all.

If your UI hides something but your API still serves it… well, that's just security theater.

The server must decide:

- Who you are
- What you can access

Everything else is noise.

### 4. Watch for weird access patterns

If someone is requesting:

```
/user/1
/user/2
/user/3
```

in quick succession, that's not normal behavior.

Logging helps. Monitoring helps more.


## Quick check


**If I change a parameter in the request, can I see someone else's data?**

If the answer is even maybe, you've got a problem.

---

## Final note

IDOR isn't clever. It doesn't need to be.

It works because people assume things are fine when they're not. A missing check here, a shortcut there—and suddenly your data isn't yours anymore.

So yeah. Check access. Then check it again. And maybe don't trust that URL parameter as much as you think you should.
