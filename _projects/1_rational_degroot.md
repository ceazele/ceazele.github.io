---
layout: page
title: "Rational DeGroot Learning"
description: "Agents strategically choose attention weights in DeGroot learning on networks, balancing naive averaging and full rationality."
img: assets/img/rational_degroot.jpg
importance: 1
category: research
related_publications: false
---

<!-- NOTE FOR LYLE: The one-line description above is adapted from your abstract. 
     Replace img path with your chosen thumbnail. -->

Rational DeGroot Learning is a working paper studying a game of social learning on networks in which agents choose how much attention to pay to their neighbors before engaging in DeGroot-style averaging.

### Abstract

We study a game of social learning on networks in which agents choose how much attention to pay to their neighbors before engaging in DeGroot-style averaging. Each agent minimizes the variance of her long-run belief by choosing how to weight her neighbors, subject to a minimum attention constraint ε≥0 on every edge. This framework occupies a middle ground between fully rational Bayesian updating and naive DeGroot updating: agents strategically adjust for the "double-counting" problem identified by DeMarzo, Vayanos, and Zwiebel (2003) while retaining the simple averaging rule. We characterize the best response using a universal *score vector*, which ranks all agents by their marginal informational value, and all agents agree on this ranking. Intuitively, agents should pay less attention to neighbors who are connected to the most influential agents through many short paths, formalizing the double-counting intuition. Turning to equilibrium, we show that without attention constraints, every strongly connected equilibrium achieves the first-best (uniform influence), though echo chambers may persist as coordination failures. With the constraint ε>0, a strictly convex reformulation yields a unique equilibrium influence vector. The first-best outcome, where all agents have uniform influence, is achievable whenever ε≤ε*, a network-dependent threshold we characterize using a transportation problem with a natural economic interpretation in terms of supplies and demands of attention. For undirected networks, ε* equals the largest feasible minimum attention level, so the first-best is always achievable. For directed networks, ε* can be strictly smaller; above ε*, we show that the welfare cost of forced attention on an edge and the cost of missing edges are determined by the universal score vector.

### Authors

- Lyle Goodyear
- Markus Mobius

*Working paper. Not yet publicly available.*
