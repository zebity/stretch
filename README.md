# Trio

A derivation of the default [Casper](https://github.com/TryGhost/Casper) theme for [Ghost](http://github.com/tryghost/ghost/). The purpose of this deriviation is to add support for additional title landing pages, which can be managed using existing Ghost Admin client.

This is the latest development version of Trio! If you're just looking to download the latest release, head over to the [releases](https://github.com/zebity/trio/releases) page.

&nbsp;

![screenshot-desktop](https://github.com/zebity/trio/blob/trio/assets/ghost-trio-theme-01.png)

&nbsp;

# First time using a Ghost theme?

Ghost uses a simple templating language called [Handlebars](http://handlebarsjs.com/) for its themes.

This theme has lots of code comments to help explain what's going on just by reading the code. Once you feel comfortable with how everything works, we also have full [theme API documentation](https://ghost.org/docs/themes/) which explains every possible Handlebars helper and template.

**The main files are:**

- `default.hbs` - The parent template file, which includes your global header/footer
- `index.hbs` - The main template to generate a list of posts, usually the home page
- `indexii.hbs` - The template to generate sub-volume list of posts, this will render volume specific landing page
- `post.hbs` - The template used to render individual posts
- `page.hbs` - Used for individual pages
- `tag.hbs` - Used for tag archives, eg. "all posts tagged with `news`"
- `author.hbs` - Used for author archives, eg. "all posts written by Jamie"

One trick (as per Casper) is that you can also create custom one-off templates by adding the slug of a page to a template file. For example:

- `page-about.hbs` - Custom template for an `/about/` page
- `tag-news.hbs` - Custom template for `/tag/news/` archive
- `author-ali.hbs` - Custom template for `/author/ali/` archive


# Development

Trio styles (as per Casper) are compiled using Gulp/PostCSS to polyfill future CSS spec. You'll need [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com/) and [Gulp](https://gulpjs.com) installed globally. After that, from the theme's root directory:

```bash
# install dependencies
yarn install

# run development server
yarn dev
```

Now you can edit `/assets/css/` files, which will be compiled to `/assets/built/` automatically.

The `zip` Gulp task packages the theme files into `dist/<theme-name>.zip`, which you can then upload to your site.

```bash
# create .zip file
yarn zip
```

# PostCSS Features Used

- Autoprefixer - Don't worry about writing browser prefixes of any kind, it's all done automatically with support for the latest 2 major versions of every browser.
- [Color Mod](https://github.com/jonathantneal/postcss-color-mod-function)

# Installation

- As Trio uses custom helpers it needs to have these and the gacan updated install to run.
- Installation is to:
  - Intall theme vis GUI
  - Run script to copy required files into your ghost installation
  - Restart ghost


# SVG Icons

Trio (like Casper) uses inline SVG icons, included via Handlebars partials. You can find all icons inside `/partials/icons`. To use an icon just include the name of the relevant file, eg. To include the SVG icon in `/partials/icons/rss.hbs` - use `{{> "icons/rss"}}`.

You can add your own SVG icons in the same manner.


# Copyright & License

Copyright (c) 2023 Graphica Software / Dokmai Pty Ltd (Extensions) - Released under the [MIT license](LICENSE).

Derived from Casper - Copyright (c) 2013-2022 Ghost Foundation - Released under the [MIT license](LICENSE).

