---
title: Rebuild My Blog with NextJS
date: '2023-08-06'
spoiler: rewrite my blog with nextjs, statc site generate
---

## Old One
原先的 blog 是从 react 大神 https://overreacted.io/ 那里 fork 过来的。 大神已经不写 blog 了，代码也已经都老了，想要升级改个东西，各种不兼容。所以决定重写一个，顺便学习一下 nextjs。

## NextJS
为什么用 NextJS， 因为 Vercel 的很好用，NextJS 正是 Vercel 出品的。 参考 NextJS 的![官方文档](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation)， 已经静态站点很快就生成了。

## markdown 文件/文件夹
官方教程里的文章是一个 markdown 文件一篇文章。 这个处理起来简单，但是使用的时候不太方便，尤其是涉及图片的时候，需要给每个图片找到图床，然后在文章里直接使用 url。  https://overreacted.io/ 使用文件夹作为基础，一篇文章一个文件夹，图片可以直接放在文件夹内，使用方便。

修改一个遍历 markdown 文件的代码。

```javascript
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
```
每个文章的名字都必须是 `index.md`


### 把图片复制到 public 文件夹下

每次编译时，把旧的图片删掉，重新生成。

```javascript
import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import sharp from 'sharp';

const fsPromises = fs.promises;
const targetDir = './public/images/posts';
const postsDir = './posts';


async function createPostImageFoldersForCopy() {
  const dirents = fs.readdirSync(postsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());

    const allPostsFolder = dirents.map(async (dirent) => {
        
        const folderName = dirent.name

        const allowedImageFileExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

        const postDirFiles = await fsPromises.readdir(path.join(postsDir, folderName));
        
        // Filter out files with allowed file extension (images)
        const images = postDirFiles.filter(file =>
          allowedImageFileExtensions.includes(path.extname(file)),
        );

        if (images.length) {
          // Create a folder for images of this post inside public
          await fsPromises.mkdir(`${targetDir}/${folderName}`);
    
          await copyImagesToPublic(images, folderName); // TODO
        }
    });
    
  }

  async function copyImagesToPublic(images, slug) {
    for (const image of images) {
      await sharp(`${postsDir}/${slug}/${image}`)
        .resize({width: 900})
        .toFile(`${targetDir}/${slug}/${image}`)
    }
  }

  await fsExtra.emptyDir(targetDir);
  await createPostImageFoldersForCopy();
```

同时需要修改生成的 html 文件，把 markdown 文件里的相对路近，改成绝对路径

```javascript
import { visit } from 'unist-util-visit';

const imgDirInsidePublic = 'images/posts';

export default function transformImgSrc({slug}) {
    return (tree) => {
        visit(tree, 'paragraph', node => {
            if (node !== undefined && node.children !== undefined) {
                const image = node.children.find(child => child.type === 'image');
                if (image) {
                    const fileName = image.url.replace('./', '');
                    image.url = `/${imgDirInsidePublic}/${slug}/${fileName}`;
                }
            }
        });
    };
}
```

在编译生成 html 文件时，进行转换,

```javascript
    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(remarkParse)
        .use(html, { sanitize: false })
        .use(transformImgSrc, { slug: id })
        .use(remarkGfm)
        .use(prism)
        
        .process(matterResult.content);
        
    const contentHtml = processedContent.toString();

```


到这里基本就搬迁完成了。源代码在这里： https://github.com/jun1st/new-blog