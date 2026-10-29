---
id: 445ebfd8-ba4b-4a15-995a-f199a45284f1
position: 5
title: "What failed"
archived: false
---
The failure was in the integrity of the build environment. According to SolarWinds' filing, the vulnerability was inserted through a compromise of the build system, so a review of the source repository would not have found it. Customers installed the updates because they trusted the vendor.

On the customer side, the monitoring platform had broad privileges. Restricting what such tools can reach, and watching for new outgoing connections and unusual identity activity, are sensible defences. For vendors, protecting the build means separating it from other systems and verifying its output. These are lessons drawn from the case, since the public sources do not list every internal failure at SolarWinds.
