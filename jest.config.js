module.exports = {

    moduleFileExtensions: [
        'js',
        'jsx',
        'ts',
        'tsx'
      ],
      transform: {
        '^.+\\.tsx?$': 'ts-jest'
      },
      testMatch: [
        '**/*.spec.(js|jsx|ts|tsx)'
      ],
      globals: {
        'ts-jest': {
          babelConfig: false
        }
      },
}