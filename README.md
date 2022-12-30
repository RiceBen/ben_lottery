# Special Thanks

This project inspire by [fouber.lottery](https://github.com/fouber/lottery)

# GOAL

本專案是以上述參考為基礎演進，目標是給有抽獎需求但是又不想因此維護 server 想省錢的情境所打造。
因此要讓本專案執行起來就只需要讓瀏覽器打開 HTML 頁面即可，資料都會暫存於瀏覽器的記憶體中。

## Tech Stack

- Style 
  - [bulma](https://bulma.io/)
  - [ionicons](https://ionic.io/ionicons)
- Frontend library
  - [Vuejs (Vue 3)](https://vuejs.org/)
  - [lodash](https://lodash.com/)
  - [tagcanvas](https://www.goat1000.com/tagcanvas.php)

## User Guide

1. 確保 `award.js` 裡面的獎項都已經設定好
2. 確保 `member.js` 裡面的人員都已經設定好
3. 用瀏覽器打開 `index.html` 

## Drawing Flow：

滑鼠點擊 `抽!` 這個按鈕，並按下 `停!` 按鈕即可，會一次把此次抽的獎項需要的名額一口氣抽完。
若已經沒有獎項可以抽，就會直接跳出提示視窗。

### Key variable and file

- config/award.js: 存放這次要抽的獎項，由上到下
- config/member.js: 存放這次可以抽的人員名單
- models/storage.js: 控制資料儲存的 library，可以藉由呼叫 `init(boolean)` 方法控制是 session 或 local。
- app.js: 主要進入點