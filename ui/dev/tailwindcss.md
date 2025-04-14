````json
{
  "includeLanguages": {
    "ftl": "html",
    "jinja": "html",
    "jinja2": "html",
    "smarty": "html",
    "tmpl": "gohtml",
    "cshtml": "html",
    "vbhtml": "html",
    "razor": "html"
  },
  "files": {
    "exclude": [
      "**/.git/**",
      "**/node_modules/**",
      "**/.hg/**",
      "**/.svn/**"
    ]
  },
  "emmetCompletions": false,
  "classAttributes": [
    "class",
    "className",
    "ngClass"
  ],
  "colorDecorators": true,
  "showPixelEquivalents": true,
  "rootFontSize": 16,
  "hovers": true,
  "suggestions": true,
  "codeActions": true,
  "validate": true,
  "lint": {
    "invalidScreen": "error",
    "invalidVariant": "error",
    "invalidTailwindDirective": "error",
    "invalidApply": "error",
    "invalidConfigPath": "error",
    "cssConflict": "warning",
    "recommendedVariantOrder": "warning"
  },
  "experimental": {
    "configFile": null,
    "classRegex": [
      [
        "cva\\(((?:[^()]|\\([^()]*\\))*)\\)",
        "[\"'`]([^\"'`]*).*?[\"'`]"
      ],
      [
        "cx\\(((?:[^()]|\\([^()]*\\))*)\\)",
        "(?:'|\"|`)([^']*)(?:'|\"|`)"
      ]
    ]
  }
}

````

https://cva.style/docs/getting-started/installation#intellisense
To enable intelli-sense for tailwind inside a cva function
add:

````json
{
  "tailwindCSS.experimental.classRegex": [
    [
      "cva\\(((?:[^()]|\\([^()]*\\))*)\\)",
      "[\"'`]([^\"'`]*).*?[\"'`]"
    ],
    [
      "cx\\(((?:[^()]|\\([^()]*\\))*)\\)",
      "(?:'|\"|`)([^']*)(?:'|\"|`)"
    ]
  ]
}
````