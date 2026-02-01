# Pageless 📽

A privacy-first, client-side speed-reading web app that plays documents word-by-word at configurable speeds.

## Live Site
https://pageless.me/
## Features

- Frontend-only
- Local storage via IndexedDB
- Adjustable WPM (90 - 1,500)
- File uploads + text input
- Offline support
- Scrubbing
- Time remaining / elapsed
- Fullscreen focus mode
- 9+ themes
- Option to see previous & following words

## Screenshots

### Home
![Home](https://i.ibb.co/7dw88y30/home-screenshot.png)
### Player
![Player](https://i.ibb.co/jv5Wf3v8/player-view.png)
### Player (multiple words)
![Player](https://i.ibb.co/zTPbbBVx/player-multiple-words.png)

## Why Did I Build This?

As a student who struggles to stay focussed when reading or studying, especially for long periods of time, I struggled to find a system or an app that allowed me to remain concentrated on the information I was trying to absorb. Then I came across [this tweet](https://x.com/SteveLovesAmmo/status/2011227134556348544) showcasing how different words-per-minute speeds looked like. Watching the video, I was taken aback by the speed at which I was able to understand the text, and how much easier it was to keep reading when the information was zooming past me. This was made especially easier by making the middle letter a standout colour. I was inspired to create a website that emulated this effect. So that's exactly what I did. 

My hope is that others like myself are able to find this site helpful for whatever needs that may arise for them.
## Privacy

Pageless runs entirely in the browser. Uploaded documents and reader data never leave your device and are stored locally in IndexedDB.
## Architecture

### Tech Stack
- Vue 3
- Vuetify
- IndexedDB
- PDF js
- Mammoth js
- Deployed as static site with CDN
### Valid File Formats
- pdf
- docx
- txt
- md
- rtf
- html
- odt
- epub
- pptx

### Creating a Player:
- if the user uploaded a file, the text is parsed, all words are extracted, and non-text elements are discarded
- there must be at least 10 words to create a player
- the program then stores a new Object in IndexedDB including a unique id, the player title, speed and words

### Player Functionality:
- the player object is loaded based on the id in the url
- the wordIndex ref tracks which word should be shown and is set to 0 on page load
- on mount, an interval is set to run every 10ms
- if the player is not paused, it will check when wordIndex was last updated (lastSwitchedWord)
- if the current time subtracted by lastSwitchedWord is greater than 60 divided by the speed (words per minute), wordIndex is increased by 1 and lastSwitchedWord is set to the current time
- if the wordIndex has reached the end, the interval automatically resets it to 0

### UI:
- scrubbing works by binding the v-model of a v-slider element to the wordIndex and setting the step to 1
- the play/pause button toggles the paused ref
- the fullscreen button toggles fullscreen on the player div
- the current, previous, and next words are calculated using computed references
## Roadmap

I currently feel that the core functionality of the site is complete. Depending on user feedback, I may implement the following:
- optional cloud sync
- export & import
- account creation
- annotations
- more themes

##  About Me
I'm a full stack developer with 8 years of experience who will be starting university next year. My main stack is Vue for frontend and Laravel for backend. I focus on building production-quality tools that I actually use, and I’m actively expanding my public portfolio.
