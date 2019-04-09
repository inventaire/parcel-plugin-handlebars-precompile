const { precompile } = require('handlebars');
const { Asset } = require('parcel-bundler');

class HbsAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = 'js';
  }

  async generate() {
    const precompiled = precompile(this.contents);
    const code = `import Handlebars from 'handlebars/dist/handlebars.runtime';
        const templateFunction = Handlebars.template(${precompiled});
        export default templateFunction;`;

    return [{
        type: 'js',
        value: code
    }];
  }
}

module.exports = HbsAsset;