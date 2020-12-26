module.exports = (api) => {
  api.cache(true);

  const presets = [
    [
      'next/babel',
      {
        "preset-env": {},
        "transform-runtime": {},
        "styled-jsx": {},
        "class-properties": {}
      }
    ]
  ];
  const plugins = [
    "babel-plugin-glsl"
  ];

  return {
    presets,
    plugins,
  };
};