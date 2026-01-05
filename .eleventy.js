module.exports = function (eleventyConfig) {
  // Serve static files
  eleventyConfig.addPassthroughCopy({ "src/style.css": "style.css" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });

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
