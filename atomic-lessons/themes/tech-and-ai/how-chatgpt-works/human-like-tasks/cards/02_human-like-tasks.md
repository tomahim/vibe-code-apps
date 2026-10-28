---
id: 73af60da-cbc0-4400-9264-3567f23e21a8
position: 2
title: "Why pixel matching fails"
archived: false
---
The same digit can appear in many shapes and positions. Exact pixel comparison cannot reliably recognize every variation.

Two people can write the digit 4 with different angles, line widths, and positions on a page. A pixel-by-pixel lookup would need separate stored examples for many tiny changes. A useful recognizer instead learns features that remain informative across those changes. For instance, shifting the entire digit a few pixels should not necessarily change its identity. The essay uses this point to bridge from memorizing examples to generalizing from them. The network does not need an explicit programmer rule saying how every possible 4 must look.
