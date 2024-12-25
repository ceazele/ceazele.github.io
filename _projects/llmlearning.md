---
layout: page
title: "History Representation and LLM Learning in Games"
description: "Examining the impact of state representations on equilibrium convergence and regret minimization in multi-agent repeated games with LLM agents"
img: assets/img/workingpaper.jpg
importance: 1
category: research
related_publications: false
---

Strategic decision-making is a field modeling how rational actors make decisions according to the information present in their environment, applicable to numerous domains such as economics, social systems, robotics, and artificial intelligence. The dynamic nature of such domains has prompted research into dynamic decision making, spawning fields like reinforcement learning which models how agents make optimal decisions in response to a changing environment. In particular, repeated games have emerged as a canonical framework for studying dynamic decision making among multiple strategic actors who learn and respond to each other over time.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/workingpaper.jpg" title="History Representation and LLM Learning in Games" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Working paper. We're aiming to submit to EC '25.
</div>

### Introduction
In such games, agents make decisions while taking into account the history of actions taken by themselves and other players, as well as the rewards each player has earned. In RL literature, the space of all such information relevant to decision making is known as the state, and it can be represented in many ways. Previous work has studied how different state representations affect learning, including how to choose the optimal state representation in a general online setting. We extend this work by examining the effect of different state representations on equilibrium convergence and regret minimization in a multi-agent repeated game inspired by congestion in networks, a complex and realistic economic setting.

We create a framework to characterize the possible representations for this game which can be extrapolated to general repeated games. A state representation may include, at some level of granularity, the previous decisions made by agents, the payoffs incurred by agents, and the regrets incurred by agents. Each of these categories of information can be reported about the agent making decisions, or it can be reported about the agent’s opponents in the game, each to varying levels of granularity. We investigate the extent to which information about oneself and about others affects learning and reward outcomes in the game.

### LLM Integration
We are motivated by recent advancements in large language model (LLM) decision making. In particular, we study LLM agents which call upon an LLM as an oracle for reasoning. LLM agents have shown promise as decision makers in online environments, and researchers have taken interest in studying how LLMs interact in repeated games. These agents must be provided with a natural language state representation to extrapolate information from the history of play and make decisions. However, prior literature has not explored the effect of state representation on learning in such agents powered by LLMs. To address this, we test a number of state representations according to our framework, varying the amount of historical information about the prompted agent, the agent’s opponents, and the natural language representation of the information. We measure our results against the theoretical equilibrium of the game as well as an identical study with human subjects, providing two points of comparison for expectations of agent performance in this setting. We aim to provide guidance to researchers studying dynamic strategic decision making, particularly in multi-agent settings with LLMs.

### Team
- **Lyle Goodyear**
- **Rachel Guo**
- **Ramesh Johari**
