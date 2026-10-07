The Model Context Protocol (MCP) is an open specification designed to standardize how Large Language Models (LLMs) and AI agents connect to tools and data sources, whether they are enterprise databases or external APIs. MCP has simplified agentic workflows. Before it, integrating a model required function-calling schemas, fragmented API wrappers, and ad-hoc client configurations.

MCP acts as a universal translator. Instead of the AI needing to learn the "language" of every software tool, MCP makes all tools talk to the AI using one shared, standard language.

![Model Context Protocol Architecture](/blogs/img/mcp_vulnerabilities/image1.png)

---

Let's look at two real-world cases.

---

## 1. Nginx-UI: Unauthenticated MCP Endpoint

- **CVE:** CVE-2026-33032
- **CWE:** CWE-306, Missing Authentication for Critical Function
- **CVSS:** 9.8 Critical
- **Affected:** Nginx-UI up to 2.3.3 according to the researcher analysis; the official CVE record lists 2.3.5 and earlier (see the note below)
- **Fixed:** 2.3.4 (the latest release, 2.3.6, is the safest target)

> **Version note:** Sources disagree on the exact affected range. Because of this discrepancy, the safest remediation is to update to the latest Nginx-UI release rather than stopping at 2.3.4.

Nginx-UI is a web interface for managing and configuring Nginx.

An administrative MCP server should enforce a security flow such as:

Request → Authentication → Authorization → Tool Execution

- **Authentication** answers: Who are you?
- **Authorization** answers: Are you allowed to perform this operation?
- **Tool execution** performs the requested privileged action.

Authentication is supposed to establish the identity of the party making a request before that request can reach privileged functionality. In a secure design, a request goes through authentication, then authorization, and only then execution of the requested operation.

Traditional web applications already have this problem, but MCP makes it particularly interesting because the interface is explicitly designed to expose tools. Authentication on one endpoint does not automatically protect every other component of an application.

The problem in Nginx-UI was that the MCP handshake endpoint and the endpoint that processes MCP messages did not enforce the same security requirements. The initial `/mcp` endpoint was protected by authentication, but `/mcp_message` lacked the corresponding authentication middleware.

The vulnerability can also be understood as a confused deputy problem. Nginx-UI holds administrative authority over the Nginx service, while an unauthenticated remote user should hold none of that authority. When the application accepts an unauthenticated MCP request and performs an administrative operation on the requester's behalf, Nginx-UI becomes a privileged deputy acting for an untrusted party. The attacker does not need direct operating-system access to Nginx. They use the application's existing authority to perform actions that should only be available to an administrator.

The vulnerability demonstrates a fundamental principle of secure protocol design: session establishment and authorization are separate security properties. Creating or recognizing an MCP session does not prove that the party using a later endpoint is authorized to perform administrative operations. A secure implementation must maintain the relationship between a session, its authenticated identity, and the permissions tied to that identity throughout the entire interaction. Nginx-UI failed to maintain that relationship at the `/mcp_message` execution boundary.

---

## 2. mcp-remote: CVE-2025-6514

- **CVE:** CVE-2025-6514
- **Severity:** Critical
- **CVSS:** 9.6
- **CWE:** CWE-78, OS Command Injection
- **Affected:** mcp-remote >= 0.0.5 and < 0.1.16
- **Fixed:** 0.1.16

The mcp-remote component operates as a bridge between an MCP client and a remote MCP server. During the connection and authorization process, the client receives information from the remote server, including the authorization endpoint. The problem occurs because the client processes this attacker-controlled information in a way that can influence operating-system command execution.

The security principle involved is the separation between trusted program instructions and untrusted data. Information received from a remote server should be treated as data, regardless of whether it appears inside a protocol message, configuration value, URL, or metadata field.

A secure program treats a URL as an argument to a program. An unsafe implementation instead builds a command from a string containing that URL and passes the resulting string to an operating-system command interpreter. In this vulnerability, attacker-controlled information from the authorization flow could reach an operating-system command execution path without adequate protection against command injection. Command injection occurs when data that should remain a value instead becomes part of the syntax interpreted by a command processor.

Developers often think about security mainly at the point where an MCP client begins invoking tools. However, a remote server can already influence the client during connection establishment, discovery, metadata processing, and authentication. These stages must be treated as security-sensitive operations.

The consequence is particularly serious because the vulnerable component runs on the user's machine, not on the remote MCP server. A malicious MCP server does not need to compromise itself. It can provide specially crafted input to a vulnerable client and potentially cause the client machine to execute commands with the privileges of the affected process.

![mcp-remote OS Command Injection (CVE-2025-6514)](/blogs/img/mcp_vulnerabilities/image2.png)

---

## Security lessons

- Authenticate every endpoint involved in tool execution.
- Don't assume authentication on an initialization endpoint protects later endpoints.
- Apply authorization at the actual privileged operation.
- Default security controls to deny, not allow.
- Treat MCP tools as privileged APIs.
- Separate session establishment from authorization.
- Log tool invocations and administrative operations.

Upgrade mcp-remote to 0.1.16 or later. For Nginx-UI, update to 2.3.4 or later, preferably the latest release.

---

## References

- Nginx-UI, GitHub Security Advisory GHSA-h6c2-x2m2-mwhf (CVE-2026-33032): <https://github.com/0xJacky/nginx-ui/security/advisories/GHSA-h6c2-x2m2-mwhf>
- NVD, CVE-2026-33032: <https://nvd.nist.gov/vuln/detail/CVE-2026-33032>
- mcp-remote, GitHub Advisory GHSA-6xpm-ggf7-wc3p (CVE-2025-6514): <https://github.com/advisories/GHSA-6xpm-ggf7-wc3p>
- NVD, CVE-2025-6514: <https://nvd.nist.gov/vuln/detail/CVE-2025-6514>
- JFrog Research, "Critical RCE vulnerability in mcp-remote (CVE-2025-6514)": <https://jfrog.com/blog/2025-6514-critical-mcp-remote-rce-vulnerability>
> source: <https://github.com/advisories/GHSA-6xpm-ggf7-wc3p>
