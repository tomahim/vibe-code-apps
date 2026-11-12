---
id: b42c7ea1-1712-4f3a-9c39-76bd6731dfa3
position: 1
title: From chatbot to agent
archived: false
---


A plain chatbot is a model in a box: text goes in, text comes out. An agent is a model in a workplace. It can read files, search a repository, run shell commands, call APIs and execute tests, looping between reasoning and action until the job is done. Frameworks like LangGraph, the OpenAI Agents SDK or CrewAI exist to build exactly this loop, and they have made assembling a basic agent almost easy.

The catch is that the loop alone does not make the agent good at anything. What makes it effective is the content of the workplace: what the instructions say, which tools exist and how their use is described, what the agent remembers between sessions, and which procedures it can load when a familiar problem appears. All of that surrounding material is the harness. Two agents using the identical model can behave completely differently because their harnesses differ, and the paper notes that even a strong model performs substantially differently under different harnesses.
