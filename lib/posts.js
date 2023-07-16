import fs from 'fs'
import path, { dirname } from 'path'
import matter from 'gray-matter'
import remarkParse from 'remark-parse'
import html from 'remark-html';
import prism from 'remark-prism';
import remarkGfm from 'remark-gfm';

import transformImgSrc from './transform-img-src.mjs';
import { remark } from 'remark'



const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {

    const dirents = fs.readdirSync(postsDirectory, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());

    const allPostsFolder = dirents.map((dirent) => {
        
        const folderName = dirent.name

        const fullPath = path.join(postsDirectory, folderName, "index.md");
        const fileContents = fs.readFileSync(fullPath, 'utf-8')

        const matterResult = matter(fileContents);
  
        return {
            id: folderName,
            ...matterResult.data,
        };
    });

    return allPostsFolder.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    })
}

export function getAllPostIds() {
    const dirents = fs.readdirSync(postsDirectory, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());

    return dirents.map((dirent) => {
    
        const folderName = dirent.name

        return {
            params: {
                id: folderName
            }
        };
    });
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, id, 'index.md');
    const fileContents = fs.readFileSync(fullPath, 'utf8');
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
  
    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(remarkParse)
        .use(html, { sanitize: false })
        .use(transformImgSrc, { slug: id })
        .use(remarkGfm)
        .use(prism)
        
        .process(matterResult.content);
        
    const contentHtml = processedContent.toString();

    // Combine the data with the id
    return {
      id,
      contentHtml,
      ...matterResult.data,
    };
  }