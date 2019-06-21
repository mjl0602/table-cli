module.exports = {
  plugins: {
    "postcss-import": {},
    "postcss-url": {},
    autoprefixer: {},
    "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": { utf8: false },
    "postcss-cssnext": {},
    "postcss-px-to-viewport": {
      viewportWidth: 750,
      viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
      unitPrecision: 3,
      viewportUnit: "vw",
      selectorBlackList: [".ignore", ".hairlines"],
      minPixelValue: 1,
      mediaQuery: false,
      exclude: /(\/|\\)(node_modules)(\/|\\)/ // 不转换node_modules里面的样式
    },
    "postcss-viewport-units": {},
    cssnano: {
      preset: "advanced",
      autoprefixer: false,
      "postcss-zindex": false
    }
  }
};
