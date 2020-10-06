const { precompile } = require('handlebars');
const { Asset } = require('parcel-bundler');
const getPartialsPaths = require('./get_partials_paths');

class HbsAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = 'js';
  }

  async generate() {
    const precompiled = precompile(this.contents);

    // inventaire-client hack: pre-import all {{partials}} to force Parcel to include them in the bundle
    // otherwise we get "Cannot resolve dependency" errors
    const partialsImports = getPartialsPaths(this.contents)
      .map(path => `import '${path}';`)
      .join('\n')

    const code = `import Handlebars from 'handlebars/dist/handlebars.runtime';
        ${partialsImports}
        const templateFunction = Handlebars.template(${precompiled});
        module.exports = templateFunction;`;

    return [{
        type: 'js',
        value: code
    }];
  }
}

module.exports = HbsAsset;