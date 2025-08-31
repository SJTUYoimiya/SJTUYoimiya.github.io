---
title: '{{ .BaseFileName | replaceRE `^[0-9]{4}-[0-9]{2}-` "" | replaceRE "-" " " | title }}'
date: {{ .Date }}
categories: "{{ (path.Dir .Path) }}"
tags: []
draft: true
isCJKLanguage: true
layout: "article"
---
