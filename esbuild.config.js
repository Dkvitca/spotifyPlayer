// esbuild.config.js
const esbuild = require('esbuild');
const fs = require('fs');

esbuild.build({
  entryPoints: {
    'background': './src/background.ts'
  },
  bundle: true,
  outdir: 'dist', // Specify the output directory
  sourcemap: true,
  minify: false, // Set to true for production build
  plugins: [
    {
      name: 'html',
      setup(build) {
        build.onLoad({ filter: /\.html$/ }, async (args) => {
          const fileContents = await fs.promises.readFile(args.path, 'utf8');
          return { contents: fileContents, loader: 'text' };
        });
      },
    },
  ],
}).catch(() => process.exit(1));
