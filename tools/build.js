/**
 * Babel Starter Kit | https://github.com/kriasoft/babel-starter-kit
 * Copyright (c) Konstantin Tarkus <hello@tarkus.me> | The MIT License
 */

import del from 'del';
import fs from './utils/fs';
import compile from './utils/compile';
import { rootDir } from './config';

// Clean output directories
const cleanup = async () => new Promise((resolve) => {
  del(['build/*', 'lib/*', '!build/.git'], {dot: true}, resolve);
});

// Compile the source code into a distributable format
const src = async () => {
  const babel = require('babel');
  const files = await fs.getFiles('src');

  for (let file of files) {
    let source = await fs.readFile('src/' + file);
    let result = babel.transform(source);
    await fs.writeFile('lib/' + file, result.code);
    await fs.writeFile('lib/' + file.substr(0, file.length - 3) + '.babel.js', source);
  }
};

// Compile and optimize CSS for the documentation site
const css = async () => {
  const source = await fs.readFile('./docs/css/main.css');
  const css = await compile.css(source);
  await fs.makeDir('build/css');
  await fs.writeFile('build/css/main.min.css', css);
};

// Compile HTML pages for the documentation site
const html = async () => {
  let source, output;
  const files = await fs.getFiles('docs');
  for (let file of files) {
    if (file.endsWith('.md')) {
      source = await fs.readFile('docs/' + file);
      output = await compile.md(source, { root: rootDir });
      await fs.writeFile('build/' + file.substr(0, file.length - 3) + '.html', output);
    }
  }
};

// Run all build steps in sequence
(async () => {
  try {
    console.log('clean');
    await cleanup();
    console.log('compile src');
    await src();
    console.log('compile css');
    await css();
    console.log('compile html');
    await html();
  } catch (err) {
    console.error(err.message);
  }
})();