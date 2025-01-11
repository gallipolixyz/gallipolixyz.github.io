---
layout: default
---

### **Welcome to Gallipoli Community!**   
            
We learn together, we grow together. We welcome everyone who shares our passion for security. Are you ready to explore together?

<div class="members-section">
    {% for member in site.data.members %}
    <div class="member-card">
        <img src="{{ site.baseurl }}/images/members/{{ member.avatar }}" alt="{{ member.name }}" />
        <h3>{{ member.name }}</h3>
        <p>{{ member.role }}</p>
    </div>
    {% endfor %}
</div>
