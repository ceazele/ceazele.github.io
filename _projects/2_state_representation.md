---
layout: page
title: "State Representation and LLM Behavior in Dynamic Games"
description: "How natural language state representations affect LLM agent behavior and equilibrium convergence in repeated multi-agent games."
img: assets/img/state_representation.jpg
importance: 2
category: research
related_publications: false
---

<!-- NOTE FOR LYLE: Full title from the paper is "The Effect of State Representation on LLM Agent Behavior in Dynamic Routing Games". 
     I shortened it for the page title — use whichever you prefer.
     Replace img path with your chosen thumbnail. -->

### Abstract

Large Language Models (LLMs) have shown promise as decision-makers in dynamic settings, but their stateless nature necessitates creating a natural language representation of history. We present a unifying framework for systematically constructing natural language "state" representations for prompting LLM agents in repeated multi-agent games. Previous work on games with LLM agents has taken an ad hoc approach to encoding game history, which not only obscures the impact of state representation on agents' behavior, but also limits comparability between studies. Our framework addresses these gaps by characterizing methods of state representation along three axes: *action informativeness* (i.e., the extent to which the state representation captures actions played); *reward informativeness* (i.e., the extent to which the state representation describes rewards obtained); and *prompting style* (or *natural language compression*, i.e., the extent to which the full text history is summarized).

We apply this framework to a dynamic selfish routing game, chosen because it admits a simple equilibrium both in theory and in human subject experiments (Rapoport et al., 2009). Despite the game's relative simplicity, we find that there are key dependencies of LLM agent behavior on the natural language state representation. In particular, we observe that representations which provide agents with (1) summarized, rather than complete, natural language representations of past history; (2) information about regrets, rather than raw payoffs; and (3) limited information about others' actions lead to behavior that more closely matches game theoretic equilibrium predictions, and with more stable game play by the agents. By contrast, other representations can exhibit either large deviations from equilibrium, higher variation in dynamic game play over time, or both. Taken together, these findings and our framework provide practical guidance for experimenters to systematically refine state representations when harnessing LLMs as strategic agents in dynamic settings.

### Authors

- Lyle Goodyear
- Rachel Guo
- Ramesh Johari

<!-- NOTE FOR LYLE: Add a PDF link here once you're ready to share it publicly, e.g.:
[Read the paper (PDF)](/assets/pdf/state_representation.pdf)
-->
