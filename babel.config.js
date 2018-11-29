const plugins = []

if (process.env.NODE_ENV === 'production') plugins.push(['transform-remove-console', { exclude: ['error'] }])

module.exports = {
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: 'entry'
      }
    ]
  ],
  plugins: plugins
}
