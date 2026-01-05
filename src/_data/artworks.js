const fs = require("fs");
const path = require("path");

module.exports = function () {
  const imagesDir = path.join(__dirname, "..", "images"); // src/images
  const files = fs.readdirSync(imagesDir);

  return files
    .filter((f) => /^art\d+\.(jpe?g|png|webp)$/i.test(f))
    .map((f) => {
      const slug = f.replace(/\.(jpe?g|png|webp)$/i, "");
      const number = parseInt(slug.replace(/^art/i, ""), 10);

      return {
        slug,                 // "art1"
        number,               // 1
        title: `Art ${number}`,
        image: `/images/${f}`, // "/images/art1.jpg"
        url: `/artworks/${slug}/`,
        alt: `Artwork ${number}`
      };
    })
    .sort((a, b) => a.number - b.number);
};
