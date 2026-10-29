---
id: 819ab735-a2ed-45dd-a9fe-003e25a90b4a
position: 1
title: "Why certificates matter"
archived: false
---
When you open a secure website, your browser checks a digital certificate to confirm that the site really is who it says. Certificates are issued by certificate authorities, called CAs, and browsers trust a list of them. If a CA is tricked or breached, it can issue a certificate for any site, and your browser will accept it without warning.

That makes CAs a high-value target. One compromised CA can undermine the trust of millions of users at once, because the system has no built-in way to say "this CA should not vouch for that domain". DigiNotar, a Dutch company, issued certificates used by Dutch government services as well as commercial sites, so its position of trust was larger than its size.
