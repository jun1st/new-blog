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