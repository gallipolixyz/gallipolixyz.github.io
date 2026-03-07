# Cross-Site Request Forgery (CSRF)

![CSRF diagram](/blogs/img/csrf_diagram.png)

## What is CSRF?

Cross site request forgery is a type of cybersecurity vulnerability where an attacker tricks the user into performing an action using their authenticated session without their consent or knowledge. 

The core mechanism relies on a critical browser behavior: the browser automatically includes authentication credentials (usually cookies) with every request to a domain, **regardless of where the request originates**. 

Example in the picture above - you are logged into bank.com and then visit an attacker's website in another tab. The attacker can trigger a request to bank.com to transfer money to himself. Since the request includes the session cookie with the request, bank.com server processes it as legitimate. 

## How a CSRF Attack Works

1. **Victim Logs In**: The user logs into bank.com and receives a session cookie.
2. **Visits Attacker's Site**: While maintaining the same browser session (cookies stored for the domain), the user visits a malicious website. This could happen through:
   - A malicious website
   - A hidden iframe embedded in a legitimate site
   - Malicious HTML in an email
   - An advertisement
   - A compromised forum post
3. **Hidden Request is Sent**: The attacker's website automatically sends a request from the user's browser to bank.com.
4. **Cookie is Sent Automatically**: The browser automatically includes the user's session cookie with every request to bank.com (unless SameSite protection is in place).
5. **Request Succeeds**: The bank.com server sees a valid cookie and assumes the request is legitimate, processing the unauthorized transaction.

---

### Example: Simple CSRF via GET Request

```html
<!-- Inside evil.com -->
<img src="https://twitter.com/post?tweet=AttackerMessage&api_key=user_token" />
```

When a user visits the attacker's site, this img tag automatically makes a request that could post a tweet using the user's Twitter session. 

That is because **browsers automatically send a GET request when encountering an URL in the src** (to fetch and display the image).

In this example, as we can see, there is no need for the user to perform any action, apart from visiting the website. The fetching of the image source is done automatically by the browser. 

---

## Protection Methods

### 1. CSRF Token (Token-Based Protection)

The server generates a **random CSRF token** tied to the user's session.  
Clients must include this token in every **state-changing request** (POST, PUT, DELETE).

#### Token generation

```python
import secrets
from flask import session

def generate_csrf_token():
    token = secrets.token_hex(32)
    session["csrf_token"] = token
    return token
```


#### Token validation

```python
from flask import request, session

def validate_csrf():
    token = request.headers.get("X-CSRF-Token")
    session_token = session.get("csrf_token")
    
    if not session_token or token != session_token:
        return False
    
    return True
```

The client sends the token using a custom header:

```
X-CSRF-Token: <csrf_token>
```

---

### 2. SameSite Cookie Attribute

Modern browsers support the **SameSite** cookie attribute, which prevents cookies from being sent with cross-site requests.

```python
from flask import make_response

@app.route("/login", methods=["POST"])
def login():
    response = make_response("Login successful")

    response.set_cookie(
        "session_id",
        "value123",
        samesite="Lax",
        httponly=True,
        secure=True
    )

    return response
```

The samesite="Strict" argument means the browser **never sends the cookie in any cross-site request**, preventing most CSRF attacks. samesite="Lax" is often better for usability while still providing CSRF protection

---

### 3. Origin Header Validation (Defense-in-Depth)

The server validates where the request originated from.

```python
from urllib.parse import urlparse
from flask import request

ALLOWED_HOST = "bank.com"

def valid_origin():
    origin = request.headers.get("Origin")

    if not origin:
        return False

    parsed_origin = urlparse(origin)
    return parsed_origin.hostname == ALLOWED_HOST


@app.route("/transfer", methods=["POST"])
def transfer():
    if not valid_origin():
        return "Invalid origin!", 403

    # Money transfer logic
    return "Transfer successful"
```

**Notes:**

- Prefer the **Origin** header over **Referer**
- Always parse and validate the **hostname**, not just a prefix


## Impact of CSRF Attacks

- Financial Loss
- Data Modification
- Account Compromise
- Reputation Damage


## Conclusion

CSRF is one of the simpler but effective attacks. It poses a serious threat, especially to financial applications or critical infrastructure. It is therefore important to implement the protection methods mentioned above. 


## References

- [OWASP CSRF](https://owasp.org/www-community/attacks/csrf)
- [SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)
