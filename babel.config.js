module.exports = {
  presets: [
    '@babel/present-env',
    {
      targets: {
        node: 'current',
      },
    },
    '@babel/preset-typescript',
  ],
  ignore: [],
};
