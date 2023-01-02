---
title: 'Add Sitemap to a Blog Build by NextJS'
date: '2019-11-29'
spoiler: Add sitemap to your blog build by nextjs
---

Sitemap is good for google to index your site.

Add a new file named `sitemap.xml.js` under `pages`

```jsx
import React, { Component } from "react";
import blogposts from "../posts/index";

export default class SiteMap extends Component {
  static async getInitialProps({ req, res }) {
    if (res) {
      const path = require("path");
      const fs = require("fs");

      const SITE_ROOT = process.env.SITE_ROOT || "https://blog.fengqijun.me";

      let xml = "";
      xml += '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

      blogposts.forEach(post => {
        xml += "<url>";
        xml += `<loc>${SITE_ROOT + post.path}</loc>`;
        xml += `<lastmod>${post.publishedAt}</lastmod>`;
        xml += `<changefreq>always</changefreq>`;
        xml += `<priority>0.5</priority>`;
        xml += "</url>";
      });

      xml += "</urlset>";
      res.setHeader("Content-Type", "text/xml");
      res.write(xml);
      res.end();
    }
  }
}
```

That's it. Fetch all posts data, and render an xml file with it.

```jsx
const fs = require("fs");
const path = require("path");

const DIR = path.join(process.cwd(), "/pages/posts/");
const META = /export\s+const\s+meta\s+=\s+({[\s\S]*?\n})/;
const files = fs
  .readdirSync(DIR)
  .filter(file => file.endsWith(".md") || file.endsWith(".mdx"));

module.exports = files
  .map((file, index) => {
    const name = path.join(DIR, file);
    const contents = fs.readFileSync(name, "utf-8");
    const match = META.exec(contents);

    if (!match || typeof match[1] !== "string") {
      throw new Error(`${name} needs to export const meta = {}`);
    }

    // eslint-disable-next-line no-eval
    const meta = eval("(" + match[1] + ")");

    const publishedAt = new Date(meta.publishedAt);
    // const year = publishedAt.getUTCFullYear();
    // const month = publishedAt.getUTCMonth() + 1;
    // const day = publishedAt.getUTCDate();
    return {
      ...meta,
      path: "/posts/" + file.replace(/\.mdx?$/, ""),
      index
    };
  })
  .filter(meta => meta.published)
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
```