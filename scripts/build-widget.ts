import esbuild from 'esbuild';
import postcss from 'postcss';
import { promises as fs } from 'fs';
import path from 'path';

async function buildWidget(): Promise<void> {
  try {
    console.log('Building widget...');
    
    // Read version from package.json
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
    const version = packageJson.version;
    
    const collectedCSS: string[] = [];
    
    const result = await esbuild.build({
      entryPoints: ['src/widget/widget-entry.tsx'],
      bundle: true,
      minify: true,
      format: 'iife',
      platform: 'browser',
      target: ['es2015'],
      jsx: 'automatic',
      jsxImportSource: 'react',
      write: false,
      metafile: true,
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.WIDGET_VERSION': `"${version}"`
      },
      // Enable style condition for Tailwind v4
      conditions: ['style'],
      plugins: [
        {
          name: 'postcss',
          setup(build) {
            // Handle ALL CSS imports (including from node_modules)
            build.onLoad({ filter: /\.css$/ }, async (args) => {
              const css = await fs.readFile(args.path, 'utf8');
              
              // Only process our widget styles with PostCSS, others are already processed
              if (args.path.includes('widget-styles.css')) {
                const result = await postcss([
                  require('@tailwindcss/postcss'),
                  require('autoprefixer'),
                ]).process(css, { from: args.path });
                
                collectedCSS.push(result.css);
              } else {
                // For Radix/other dependencies, use CSS as-is
                collectedCSS.push(css);
              }
              
              // Return empty JS module
              return {
                contents: '',
                loader: 'js',
              };
            });
          },
        },
      ],
    });
    
    // Get the JS bundle
    const jsBundle = new TextDecoder().decode(result.outputFiles[0].contents);
    
    // Combine all CSS
    const allCSS = collectedCSS.join('\n');
    
    // Create final output with CSS injected as global variable
    const finalOutput = `
// SAUGHT AI WIDGET v${version}
// Build time: ${new Date().toISOString()}

// Inject CSS for shadow DOM
window.__saughtWidgetCSS = ${JSON.stringify(allCSS)};

// Widget version info
window.__saughtWidgetVersion = "${version}";

// Widget code
${jsBundle}
`;

    // Write files
    await fs.mkdir('public', { recursive: true });
    
    // Write versioned file
    const versionedFilename = `v${version}.js`;
    await fs.writeFile(path.join('public', versionedFilename), finalOutput);
    
    // Write latest file (v1.js for now)
    const majorVersion = version.split('.')[0];
    const latestFilename = `v${majorVersion}.js`;
    await fs.writeFile(path.join('public', latestFilename), finalOutput);
    
    // Stats
    if (result.metafile) {
      const sizeKB = (finalOutput.length / 1024).toFixed(2);
      const inputs = Object.keys(result.metafile.inputs).length;
      const cssFiles = collectedCSS.length;
      const cssSize = (allCSS.length / 1024).toFixed(2);
      
      console.log('\n✨ Build complete!');
      console.log(`📦 Bundle size: ${sizeKB}KB`);
      console.log(`📁 Files bundled: ${inputs}`);
      console.log(`🎨 CSS files included: ${cssFiles}`);
      console.log(`💅 CSS size: ${cssSize}KB`);
      console.log(`\n📂 Output files:`);
      console.log(`  • public/${versionedFilename} (specific version)`);
      console.log(`  • public/${latestFilename} (latest v${majorVersion}.x)`);
      console.log(`\n🚀 Ready for git commit!`);
    }
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildWidget(); 