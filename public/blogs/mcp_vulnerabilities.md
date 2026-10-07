The Model Context Protocol (MCP) is an open specification designed to standardize how Large Language Models (LLMs) and AI agents connect to local tools, whether they are enterprise databases or external API's. MCP has simplified agentic workflows, prior to this integrating models required function-calling schemas, fragmented API wrappers, and ad-hoc client configurations

MCP acts as a universal translator. Instead of the AI needing to learn the "language" of every single software tool on earth, MCP forces all software tools to talk to the AI using one shared, standard language.

![Model Context Protocol Architecture](https://raw.githubusercontent.com/aymaan-balbale/gallipolixyz.github.io/main/public/blogs/img/%20Mcp_vulnerabilities/Image2.png)

---

**Let's see two cases.**

---

## 1. Nginx-UI: Unauthenticated MCP Endpoint

- **CVE:** CVE-2026-33032
- **CWE:** CWE-306, Missing Authentication for Critical Function
- **CVSS:** 9.8 Critical
- **Affected:** Nginx-UI versions up to 2.3.3, according to current advisories
- **Fixed:** 2.3.4

Nginx-UI is a web interface for managing Nginx and An administrative MCP server should enforce something like:

```
\[ Request \rightarrow Authentication \rightarrow Authorization \rightarrow Tool Execution \]
```

- **Authentication** answers: Who are you?
- **Authorization** answers: Are you allowed to perform this operation?
- **Tool execution** performs the requested privileged action.

Authentication is supposed to establish the identity of the party making a request before that request is allowed to reach privileged functionality. In a secure design, a request should follow a sequence such as authentication, authorization, and finally execution of the requested operation. Traditional web applications already have this problem but MCP makes it particularly interesting because the interface is explicitly designed to expose tools because authentication is not something that automatically protects every component of an application simply because one endpoint performs it

The problem in Nginx-UI was that the MCP handshake endpoint and the endpoint responsible for processing MCP messages did not enforce the same security requirements. Although the initial `/mcp` endpoint was protected by authentication, `/mcp_message` lacked the corresponding authentication middleware.The vulnerability can also be understood through the concept of a confused deputy. Nginx-UI possesses administrative authority over the Nginx service, while an unauthenticated remote user should possess none of that authority. When the application accepts an unauthenticated MCP request and performs an administrative operation on behalf of the requester, Nginx-UI becomes a privileged deputy acting for an untrusted party. The attacker does not need direct operating-system access to Nginx. Instead, they exploit the application's existing authority and use it to perform actions that should only be available to an administrator.

The vulnerability therefore demonstrates a fundamental principle of secure protocol design: session establishment and authorization are separate security properties. Creating or recognizing an MCP session does not, by itself, prove that the party using a later endpoint is authorized to perform administrative operations. A secure implementation must maintain the relationship between a session, its authenticated identity, and the permissions associated with that identity throughout the entire interaction. Nginx-UI failed to maintain that relationship at the `/mcp_message` execution boundary.

---

## 2. mcp-remote: CVE-2025-6514

- **CVE:** CVE-2025-6514
- **Severity:** Critical
- **CVSS:** 9.6
- **CWE:** CWE-78, OS Command Injection
- **Affected:** mcp-remote >= 0.0.5 and < 0.1.16
- **Fixed:** 0.1.16

The mcp-remote component operates as a bridge between an MCP client and a remote MCP server. During the connection and authorization process, the client receives information from the remote server, including information related to the authorization endpoint and the problem occurs because a client processes attacker-controlled information received from an MCP server in a way that can influence operating-system command execution. The fundamental security principle involved is the separation between trusted program instructions and untrusted data. Information received from a remote server should normally be treated as data, regardless of whether it appears inside a protocol message, configuration value, URL, or metadata field.

Conceptually, a secure program should treat a URL as an argument to a program. An unsafe implementation can instead construct a command from a string containing that URL and pass the resulting string to an operating-system command interpreter , The vulnerability occurred because attacker-controlled information from the authorization flow could reach an operating-system command execution path without adequate protection against command injection. Command injection occurs when data that should remain a value instead becomes part of the syntax interpreted by a command processor.

Developers often think about security primarily around the point where an MCP client begins invoking tools. However, a remote server can already influence the client during connection establishment, discovery, metadata processing, and authentication. These stages must therefore be treated as security-sensitive operations.

This creates a particularly serious consequence because the vulnerable component runs on the user's machine rather than on the remote MCP server. A malicious MCP server does not need to compromise itself. Instead, it can provide specially crafted input to a vulnerable client and potentially cause the client machine to execute commands with the privileges available to the affected process.

![mcp-remote OS Command Injection (CVE-2025-6514)](https://raw.githubusercontent.com/aymaan-balbale/gallipolixyz.github.io/main/public/blogs/img/%20Mcp_vulnerabilities/image1.png)

---

## Security lessons

- Authenticate every endpoint involved in tool execution.
- Don't assume authentication on an initialization endpoint protects later endpoints.
- Apply authorization at the actual privileged operation.
- Default security controls to deny, not allow.
- Treat MCP tools as privileged APIs.
- Separate session establishment from authorization.
- Log tool invocations and administrative operations.

The official advisories recommend upgrading mcp-remote to 0.1.16 or later, while current advisories identify Nginx-UI 2.3.4+ as the fixed release.

---

> source: <https://github.com/advisories/GHSA-6xpm-ggf7-wc3p>
