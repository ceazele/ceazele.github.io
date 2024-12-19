---
layout: page
title: "BoxingGym: Benchmarking Progress in Automated Experimental Design and Model Discovery"
description: "Evaluating experimental design and model discovery with language models"
img: assets/img/placeholder.jpg
importance: 1
category: research
related_publications: false
---

Introducing **BoxingGym**, a benchmark system developed to evaluate the ability of language models and other agents in experimental design and model discovery. 

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/boxinggym.jpg" title="BoxingGym Paper" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Paper coming soon on arXiv.
</div>

### Abstract
Understanding the world and explaining it with scientific theories is a central aspiration of artificial intelligence research. Proposing theories, designing experiments to test them, and revising them based on data are fundamental to scientific discovery. Despite the significant promise of LLM-based scientific agents, no benchmarks systematically test LLMs’ ability to propose scientific models, collect experimental data, and revise them in light of new data. We introduce BoxingGym, a systematic benchmark with 10 environments for evaluating both experimental design (e.g., collecting data to test a scientific theory) and model discovery (e.g., proposing and revising scientific theories).

### Key Contributions
- A systematic benchmark for evaluating language models in experimental design and model discovery.
- Integration of probabilistic modeling to simulate real-world scientific environments.
- Introduction of metrics such as Expected Information Gain (EIG) for experimental evaluation.
- Communication-based evaluation where agents explain models to novices.

### Team
- Kanishk Gandhi
- Michael Y. Li
- Lyle Goodyear
- Louise Li
- Aditi Bhaskar
- Mohammed Zaman
- Noah Goodman

### Further Information
For more details, visit the [BoxingGym Project Website](https://sites.google.com/view/boxing-gym-language/home).

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/placeholder.jpg" title="BoxingGym Pseudocode Example" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    A sample of the pseudocode structure for implementing the BoxingGym framework.
</div>
