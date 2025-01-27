# Email Content Generator

Quickly generate customer emails from pre-written sections that you can copy into your email client. Built as an internal tool for teams at Neto Ecommerce with [VueJS](https://vuejs.org/). 

## Demo

**[Vie demo here](https://so-neto-email.surge.sh)**

## Features

- Construct email from content sections
- Drag 'n drop to re-order sections
- Remove sections by clicking their close button
- Set and modify variables within sections like Customer name, Store name etc
- Copy constructed email to clipboard, for pasting into email client
- Supports keyboard shortcut for copying: CMD+C (Mac), CTRL+C (Windows)
- View updates to email generator in overlay
- Easily add or modify content sections by updating JSON files in: [`/content/content-department.json`](https://github.com/NetoECommerce/Neto-Forms/blob/master/email-generator/content/)
- Different content for each department. Access department generator by selecting from the dropdown `Change department` or changing the URL eg. /#/marketing or /#/onboarding. If route is wrong or doesn't exist, defaults to content.json

## Build Setup

``` bash
# install dependencies
npm install

# Dev: serve with hot reload at localhost:8080
npm run dev

# Prod: build for production with minification to the /dist folder
npm run build
```

## Updating content

When adding a new section or option: 

- The `name` is just a unique identifier and can be anything but will be the 
- The HTML in `content` must be inlined. Change all double-quote marks (") to single ('), so the JSON will parse properly
- `active` is `false` by default. Set it to `true` for any option you want the email template to contain by default (eg. introduction)

If you're running the dev server (`npm run dev`), changes to this file will show up without refreshing the page.

## TODO

- Improve component scoping
