---
layout: page
title: music
permalink: /music/
description:
nav: true
nav_order: 6
---

<div class="music-wall">
  {% for item in site.data.mixes %}
    {% if item.type == "mix" %}
      <div class="music-card music-card--mix">
        <div class="music-card__header">
          <h3 class="music-card__title">{{ item.title }}</h3>
          <div class="music-card__meta">
            {% for tag in item.tags %}
              <span class="music-card__tag">{{ tag }}</span>
            {% endfor %}
            {% if item.duration != "" %}
              <span class="music-card__duration">{{ item.duration }}</span>
            {% endif %}
          </div>
        </div>
        {% assign feed = item.mixcloud_url | remove: "https://www.mixcloud.com" %}
        <iframe class="music-card__player" src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=0&feed={{ feed | url_encode }}" frameborder="0" allow="autoplay" loading="lazy"></iframe>
      </div>
    {% elsif item.type == "photo" %}
      <div class="music-card music-card--photo">
        <img src="{{ item.image | relative_url }}" alt="{{ item.caption | default: '' }}" loading="lazy" />
      </div>
    {% elsif item.type == "youtube" %}
      <div class="music-card music-card--youtube">
        <div class="music-card__video-wrap">
          <iframe src="https://www.youtube.com/embed/{{ item.youtube_id }}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
        </div>
      </div>
    {% endif %}
  {% endfor %}
</div>
