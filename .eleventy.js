module.exports = function (eleventyConfig) {
  // Serve static files
  eleventyConfig.addPassthroughCopy({ "src/style.css": "style.css" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/favicon-16x16.png": "favicon-16x16.png" });
  eleventyConfig.addPassthroughCopy({ "src/favicon-32x32.png": "favicon-32x32.png" });
  eleventyConfig.addPassthroughCopy({ "src/apple-touch-icon.png": "apple-touch-icon.png" });
  eleventyConfig.addPassthroughCopy({ "src/og-image.jpg": "og-image.jpg" });

  // ✅ Create an "artworks" collection from all markdown files in src/artworks
  eleventyConfig.addCollection("artworks", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/artworks/*.md")
      .sort((a, b) => (a.data.sortOrder || 999) - (b.data.sortOrder || 999));
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
