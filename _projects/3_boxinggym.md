---
layout: page
title: "Benchmarking Automated Scientific Discovery"
description: "A benchmark for evaluating language models in experimental design and model discovery."
img: assets/img/projects/boxinggym.jpg
img_alt: "Wassily Kandinsky, Several Circles (1926)"
importance: 3
category: research
related_publications: false
---

<!-- NOTE FOR LYLE: Replace img path with your chosen thumbnail. -->

### Abstract

Understanding the world and explaining it with scientific theories is a central aspiration of artificial intelligence research. Proposing theories, designing experiments to test them, and then revising them based on data are key to scientific discovery. Despite the promise of LLM-based scientific agents, no benchmarks systematically test their ability to propose scientific models, collect experimental data, and revise them in light of new data. We introduce BoxingGym, a benchmark with 10 environments for evaluating experimental design (e.g., collecting data to test a scientific theory) and model discovery (e.g., proposing and revising scientific theories). To enable quantitative and principled evaluation, we implement each environment as a generative probabilistic model with which a scientific agent can run interactive experiments. These probabilistic models are drawn from various real-world scientific domains ranging from psychology to ecology. To evaluate a scientific agent's ability to collect informative experimental data, we compute the expected information gain (EIG), an information-theoretic quantity which measures how much an experiment reduces uncertainty about the parameters of a generative model. A good scientific theory is a concise and predictive explanation. To quantitatively evaluate model discovery, we ask a scientific agent to explain their model and evaluate whether this explanation helps another scientific agent make more accurate predictions. We evaluate several open and closed-source language models of varying sizes. We find that larger models (32B) consistently outperform smaller variants (7B), and that closed-source models generally achieve better results than open-source alternatives. However, all current approaches struggle with both experimental design and model discovery, highlighting these as promising directions for future research.

*Submitted to 39th Conference on Neural Information Processing Systems (NeurIPS 2025).*

### Authors

- Kanishk Gandhi
- Michael Y. Li
- Lyle Goodyear
- Agam Bhatia
- Louise Li
- Aditi Bhaskar
- Mohammed Zaman
- Noah D. Goodman

### Further Information

- [Read the paper (PDF)](/assets/pdf/science.pdf)
- [BoxingGym Project Website](https://sites.google.com/view/boxing-gym-language/home)
- [arXiv](https://www.arxiv.org/abs/2501.01540)
- [GitHub](https://github.com/kanishkg/boxing-gym/)
