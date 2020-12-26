// @js-ignore

/* eslint-disable no-undef */
const path = require('path')
const plugins = require('next-compose-plugins')
const images = require('next-images')
const videos = require('next-videos')
const fonts = require('next-fonts')
const reactSvg = require('next-react-svg')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withTM = require('next-transpile-modules')(
  [
    'three',
    '@react-three/postprocessing',
    '@react-three/drei',
    'react-three-editable/dist/components/editable.d.ts',
    'postprocessing',
  ],
  { debug: true, resolveSymlinks: true }
)
const withPWA = require('next-pwa')

const prod = process.env.NODE_ENV === 'production'

const nextConfig = {
  // target: 'serverless',
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    })
    return config
  },
}

module.exports = plugins(
  [
    [images, { exclude: path.resolve(__dirname, 'src/assets/svg') }],
    [reactSvg, { include: path.resolve(__dirname, 'src/assets/svg') }],
    fonts,
    videos,
    [withPWA, { pwa: { disable: prod ? false : true, dest: 'public' } }],
    withBundleAnalyzer,
    withTM,
  ],
  nextConfig
)
