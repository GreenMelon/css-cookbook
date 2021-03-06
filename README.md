# CSS-COOKBOOK

[中文说明](./README.zh.md)

## Install

### Clone
> git clone git@github.com:GreenMelon/css-cookbook.git

### Node Modules
> npm install

### Run
> npm run dev

> open localhost:8181 in browser

## Directory

```
├── app
│   ├── assets
│   ├── components
│   ├── config
│       └── routes.js
│
│   ├── data
│   ├── images
│   ├── less
│   ├── pages
│   ├── ...
│   ├── app.vue
│   └── main.js
│
├── node_modules
│
├── webpack.base.config.js
└── webpack.dev.config.js
```

## Modules

```
├── app
│   ├── pages
│       ├── animation
│       ├── box-model
│       ├── element
│       ├── form
│       ├── formatting-model
│       ├── pointerevents
│       ├── selector
│       ├── table
│       ├── transform
│       ├── typographic
│       └── visual
```

## lint

```
npm set-script prepare "husky install" && npm run prepare
npx husky add .husky/pre-commit "npm run lint"
```
