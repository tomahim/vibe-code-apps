---
id: a30692cc-62a5-4f06-b0cb-d74f01e23dfc
position: 6
title: "Changes after DigiNotar"
archived: false
---
The incident pushed the web toward more transparency. Certificate Transparency, started by Google engineers, is an open system of public logs in which issued certificates are recorded so mis-issuance can be spotted by domain owners and auditors. Anyone can watch the logs for certificates they did not expect for their own domains.

For users the change is mostly invisible, which is why it is worth explaining. When a browser or a monitoring service checks these logs, a certificate that was issued in secret becomes much easier to notice, so an attacker can no longer rely on silence.

The lesson is that trust in a public system needs verification and consequences, not only reputation. Source: [Fox-IT interim report on the DigiNotar incident](https://www.teletrust.de/uploads/media/FOX-IT_Interim_Report_2011-09-05_pdf.pdf) and [Certificate Transparency](https://certificate.transparency.dev/).
