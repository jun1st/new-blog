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
      // await fsPromises.copyFile(
      //   `${postsDir}/${slug}/${image}`,
      //   `${targetDir}/${slug}/${image}`
      // );
    }
  }

  await fsExtra.emptyDir(targetDir);
  await createPostImageFoldersForCopy();