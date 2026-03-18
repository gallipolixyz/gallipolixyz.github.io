# Remember Me. Forget MFA

Some of the most interesting vulnerabilities are not where you expect them.

This finding started exactly like that.

The target application had two-factor authentication. Everything looked fine. OTP code was coming, the screen was there, the flow was working.

But something got my attention.

*"What happens when Remember Me is checked?"*

![Cover Image](/blogs/img/remember-me-forget-mfa/cover.png)

---

## How I Noticed It

When testing 2FA, you usually check the same things.

OTP brute force. Code reuse. Response manipulation.

I tried all of them. None worked.

So I thought differently.

I looked at the authentication flow itself. I was getting to the OTP screen. Code was being asked. Normal.

But then I tried something:

I closed the browser without entering the code.

Opened it again.

I was directly on the dashboard.

OTP was never entered.

---

## What Was Happening Behind the Scenes

![Flow Image](/blogs/img/remember-me-forget-mfa/otp-flow.png)

The application had two different login paths.

**Path 1 — Normal login:** Email + Password -> OTP screen -> Verify OTP -> Access

**Path 2 — Remember me cookie:** remember_me token -> Direct access

There was no MFA check on the second path.

But the real problem was here.

The `remember_me` token was being set before OTP was verified.

Authentication was not complete yet. But the "remember this user" decision was already made.

When the browser closed, the session cookie was deleted. The OTP screen was gone. The half-finished authentication disappeared.

But the `remember_me` cookie was still there.

When the application saw the cookie on return, it did one thing:

Logged the user in.

MFA? Not asked.

---

## Vulnerable Code

![Code Image](/blogs/img/remember-me-forget-mfa/vulnerable-code.png)

The problem was clear.

In the login endpoint, `req.session.isAuthenticated = true` is set before MFA is completed. The user gets redirected to the OTP screen, but the session is already open.

The `restoreSession` middleware sees the `remember_me` cookie and restores the session directly. Was MFA completed? No check.

The dashboard only looks at the `isAuthenticated` flag. It never asks if OTP was verified.

All three points share the same assumption: if a user is authenticated, they passed MFA. But they did not.

---

## Impact

This was not just "leaving a session open."

The attack scenario was simple:

- Get access to the target's credentials
- Go to the login page, check "Remember Me"
- Log in, OTP screen will appear
- Close the browser and reopen it, go to the same target
- 2FA is automatically bypassed

The protection that 2FA was supposed to provide was completely gone.

---

## Timeline

06 Jan 2026 — Report submitted

07 Jan 2026 — Triaged

12 Jan 2026 — Not Applicable

12 Jan 2026 — Disputed

13 Jan 2026 — Valid — $750

27 Jan 2026 — Resolved