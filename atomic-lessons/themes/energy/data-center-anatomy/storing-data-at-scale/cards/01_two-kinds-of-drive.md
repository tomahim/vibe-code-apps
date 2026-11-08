---
id: ecc53936-4bf3-4e8b-ae09-7b294f6fa810
position: 1
title: Two kinds of drive
image: hdd-vs-ssd.png
image_alt: 'Comparison diagram: a hard disk drive with spinning platters and a moving read arm versus a solid-state
  drive with flash memory chips and no moving parts.'
image_caption: 'HDD: spinning platters, cheap terabytes. SSD: flash chips, fast and silent.'
image_license: original
archived: false
---


Two common online storage media are hard disk drives and solid-state drives; tape and other media also serve archives. Hard disk drives (HDDs) write magnetic patterns onto spinning platters, read by a mechanical arm: cheap per terabyte, but slow to find data and vulnerable to shock and wear. Solid-state drives (SSDs) store charge in flash memory cells: orders of magnitude faster, silent, with no moving parts, but several times more expensive per terabyte and with cells that wear out after many writes.

The economics keep both alive. The world's data volume grows faster than SSD prices fall, so hyperscalers still buy enormous numbers of HDDs for bulk storage while putting hot data on flash. A single modern HDD holds over 20 TB; a dense storage server packs dozens of drives in 2U or 4U of rack space. The storage fleet is usually the largest single consumer of rack slots after compute, and its steady, modest power draw, a few hundred watts per chassis, fills a reliable slice of the facility's megawatts.
