module.exports = {
  plugins: [require('autoprefixer')({}), require('postcss-plugin-px2rem')({
    'rootValue': 100,
    'mediaQuery': false,
    'unitPrecision': 2,
    'exclude': /node_modules/,
    'minPixelValue': 12
  })]
}
