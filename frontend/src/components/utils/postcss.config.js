const tailwindcss = require("tailwindcss");
module.exports = {
  plugins: [tailwindcss("./src/components/utils/tailwind.config.js"), require("autoprefixer")]
};