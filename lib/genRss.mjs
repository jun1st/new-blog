
import { getSortedPostsData } from './posts.js';
import fs from 'fs';

const outputPath = "./public/sitemap.xml";

export function genRss() {
    
    const SITE_ROOT = process.env.SITE_ROOT || "https://fengqijun.me/posts/";

    let xml = "";
    xml += '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';


    getSortedPostsData().map( post => {
        xml += "<url>";
        xml += `<loc>${SITE_ROOT + post.id}</loc>`;
        xml += `<lastmod>${post.date}</lastmod>`;
        xml += `<changefreq>always</changefreq>`;
        xml += `<priority>0.5</priority>`;
        xml += "</url>";
    })

    xml += "</urlset>";

    fs.writeFileSync(outputPath, xml);
    
}

genRss()