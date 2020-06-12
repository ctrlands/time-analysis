module.exports = {
  root: true, // 作用的目录是根目录
  extends: 'standard', // 继承标准规则
  plugins: [
    'html' // 使用eslint-plugin-html
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module' // 按照模块的方式解析
  },
  env: {
    browser: true, // 开发环境配置表示可以使用浏览器的方法
    node: true,
    es6: true
  },
  rules: {
    // 自定义规则
    'no-console': 0,
    'space-before-function-paren': ['error', 'always'],
    quotes: [1, 'single']
  }
}
