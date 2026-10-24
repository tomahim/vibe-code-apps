TEMPORARY - removed before the PR is opened.
Generator + verification toolchain for the artifact tabs work:
- engine.mjs: anatomy-kit engine extracted from the artifact's own script
- bikeparts.mjs / bikeruntime.js: bike model painters (shared by generator and page runtime)
- gen-final.mjs: assembles the final artifact HTML (read original from git, wrap panels, inline parts)
- shot.mjs / shot-steps.mjs / check2.mjs: puppeteer screenshot + DOM verification harness
