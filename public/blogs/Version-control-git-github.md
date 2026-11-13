# What is a Version control software ?

> "Version Control software is a system that records and manages state changes to a set of digital artifacts over time. In software engineering, it acts as a structured ledger for a codebase, enabling temporal navigation (reverting to previous states), concurrent development (branching and merging), and auditing. It resolves the problem of concurrent state mutation by establishing deterministic rules for integrating divergent code paths and tracking exactly who modified what, and when".

That's the textbook definition.

Basically, version control software helps you to keep track of updates and versions of a software, whether it is a major or a minor change

For instance, you updated an application and gave it your client but weeks later, the client comes back you and say that the previous version was better. practically, changing codes back to it's original state is a lengthy and tiresome process. Also, almost impossible in some case even with the help of AI. That's where the version control software ( like "Git" ) come in use.

Not only they track the version, updates, records of changes but also stores the previous state of software, through snap-short for example.

---

# Introduction to "Git" and "GitHub"

First, Git was created before GitHub by Linus Torvalds, the creator of Linux in 2005. It was developed to manage the Linux kernel's source code.

Whereas, GitHub was launched in 2008. The platform was created to make collaborating with Git easier by providing a web-based interface, cloud repository hosting, bug tracking, and social coding features. Microsoft later acquired the company in 2018, Giving it a subsidiary status of Microsoft Corporation.

> **Interesting fact:** You can use Git without GitHub, but GitHub relies on Git for its core version-control functionality. Git can also work with other hosting platforms, such as GitLab and Bitbucket.

---

# Let's look at Commands of "GitHub" :

**1. Initialize repository**

```bash
git init
```

**#2. Check repository status**

```bash
git status
```

**3. Stage files**

```bash
git add .
```

**3. Commit changes**

```bash
git commit -m "Initial commit"
```

**4. Connect remote repository**

```bash
git remote add origin <repository-url>
```

**5. Push changes**

```bash
git push -u origin main
```

---

# Branching

Creating a branch (`git checkout -b feature-branch`) lets you build new features or test bug fixes without impacting anyone else. Once the work is tested and complete, you bring those changes back into the main timeline by merging the branch (`git merge feature-branch`). Instead of making risky changes directly to your stable code (usually the main branch), you create an isolated environment.

![Diagram of a repository: a main timeline with commits c1, c2 and c3, and a feature branch with commits c2a and c2b that merges back into c3, with HEAD pointing to the current commit](/blogs/img/Version_control_git_github/Image3.png)

---

# Remote Repositories

A Remote Repository is a version-controlled project repository hosted on another computer or server, usually accessible over a network. In simple terms: Your local repository is stored on your computer, whereas a remote repository is stored somewhere else, such as GitHub.

![Local repository on your computer and GitHub repository in the cloud, connected by git push and git pull arrows](/blogs/img/Version_control_git_github/Image1.png)

**1. Clone a remote repository**

```bash
git clone <repository-url>
```

**2. Fetch latest changes from remote**

```bash
git fetch
```

**3. Pull and merge latest changes**

```bash
git pull
```

**4. Push local commits to remote**

```bash
git push
```

---

# Collaboration

Collaboration means multiple developers working together on the same software project. Git makes this possible by allowing developers to maintain separate branches, record their changes, and share their work.

![Shared project: Banking Application. A GitHub remote repository with three developers working on login.py, database.py and interface.py](/blogs/img/Version_control_git_github/Image4.png)

---

# Conflict Resolution

Conflict Resolution is the process of identifying and resolving incompatible changes made to the same parts of a project.

In Git, this commonly happens when two developers modify the same lines of a file and Git cannot automatically determine which change should be retained.

![Git merge conflicts: Branch A sets color = blue, Branch B sets color = red, producing conflict markers in the merged file](/blogs/img/Version_control_git_github/Image2.png)

For Example : two developers are working on the same application.

The original code is:

```python
welcome_message = "Welcome User"
```

Developer A changes it to:

```python
welcome_message = "Welcome Admin"
```

Developer B changes it to:

```python
welcome_message = "Welcome Customer"
```

Both developers modify the same line.

Now, when their changes are merged, Git may report a merge conflict.

```diff
<<<<<<< HEAD
welcome_message = "Welcome Admin"
=======
welcome_message = "Welcome Customer"
>>>>>>> feature-branch
```

After resolving the conflict, you save the file and stage the resolution:

```bash
git add welcome.py
git commit
```

---

Conversely, Git and GitHub provide the architectural foundation for modern DevSecOps, allowing security to be automated and integrated directly into the developer workflow

**Shift-Left Security via CI/CD:** GitHub Actions and webhooks allow security teams to embed automated scanning into the Pull Request process. Every commit can be automatically checked for vulnerable dependencies (via tools like Dependabot or Snyk), statically analyzed for insecure code (SAST), and scanned for leaked secrets before the code is ever merged into the main branch.via tools like Dependabot or Snyk), statically analyzed for insecure code (SAST), and scanned for leaked secrets before the code is ever merged into the main branch.
