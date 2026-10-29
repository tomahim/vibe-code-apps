---
id: efa695fc-7895-427f-9a4f-a6ea709b2631
position: 2
title: "What the attackers did to the build"
archived: false
---
SolarWinds' filing with the SEC says the vulnerability was inserted into Orion through a compromise of the build system, and was not present in the source code repository. Updates containing it were released between March and June 2020, and the company said fewer than 18,000 customers had installed them. CISA's alert names the backdoor SUNBURST and says the activity dates back to at least March 2020. The affected Orion versions ran from 2019.4 to 2020.2.1 HF1.

Compromising the build, rather than the final product, is what makes this technique hard to detect: reviews of the source repository would not show a change that was added only during the build. Sources: [SolarWinds SEC filing](https://www.sec.gov/Archives/edgar/data/1739942/000162828020017451/swi-20201214.htm) and [CISA AA20-352A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a).
