module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  overrides: [
    // {
    //   files: [
    //     '**/__tests__/*.{j,t}s?(x)',
    //     '**/tests/unit/**/*.spec.{j,t}s?(x)',
    //   ],
    //   env: {
    //     jest: true,
    //   },
    // },
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
      },
    },
  ],
  rules: {
    'space-before-function-paren': ['error', { anonymous: 'always', named: 'never' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-prototype-builtins': 'off',
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: ['VElement[name=strong].children', 'VElement[name=b].children', 'VElement[name=i].children', 'VElement[name=br].children'],
    }],
    'vue/name-property-casing': ['error', 'PascalCase'],
    'vue/mustache-interpolation-spacing': ['error', 'never'],
    'vue/max-attributes-per-line': ['error', {
      singleline: 5,
      multiline: {
        max: 3,
        allowFirstLine: true,
      },
    }],
    camelcase: 'off',
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never',
    }],
    'vue/html-closing-bracket-spacing': ['error', {
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'never',
    }],
    'vue/singleline-html-element-content-newline': ['warn', {
      ignoreWhenNoAttributes: true,
      ignoreWhenEmpty: true,
      ignores: ['span', 'pre', 'textarea', 'v-btn', 'v-icon', 'b-tag', 'b-icon', 'i'],
    }],
    'vue/html-self-closing': ['error', {
      html: {
        void: 'never',
        normal: 'never',
        component: 'always',
      },
      svg: 'always',
      math: 'always',
    }],
    'vue/script-indent': ['error', 2, {
      baseIndent: 1,
      switchCase: 1,
    }],
    'vue/require-default-prop': 'off',
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'no-empty': ['error'],
    'no-unreachable': ['error'],
    'no-undefined': 'off',
    curly: ['error'],
    'comma-dangle': ['error', 'always-multiline'],
    'new-cap': 'off',
    eqeqeq: 'warn',
  },
};
