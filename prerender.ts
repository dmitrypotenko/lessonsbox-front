// Load zone.js for the server.
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'fs';
import {join} from 'path';
var domino = require('domino');
const MockBrowser = require('mock-browser').mocks.MockBrowser;
const mock = new MockBrowser();

const template = readFileSync('./dist/browser/index.html').toString();
// for mock global window by domino
const win = domino.createWindow(template);
global['window'] = win;
// not implemented property and functions
Object.defineProperty(win.document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});
// mock documnet
global['document'] = win.document;
// othres mock
global['CSS'] = null;
// global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;
global['Prism'] = null;
global['navigator'] = mock.getNavigator();

import {enableProdMode} from '@angular/core';
// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';
import {renderModuleFactory} from '@angular/platform-server';
import {ROUTES} from './static.paths';

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

const BROWSER_FOLDER = join(process.cwd(), 'dist/browser');

// Load the index.html file containing referances to your application bundle.
const index = readFileSync(join(BROWSER_FOLDER, 'index.html'), 'utf8');


// Iterate each route path
ROUTES.forEach(route => {
  const fullPath = join(BROWSER_FOLDER, route);

  // Make sure the directory structure is there
  if (!existsSync(fullPath)) {
    mkdirSync(fullPath);
  }

  renderModuleFactory(AppServerModuleNgFactory, {
    document: index,
    url: route,
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  })
    .then(html => writeFileSync(join(fullPath, 'index.html'), html));
});
