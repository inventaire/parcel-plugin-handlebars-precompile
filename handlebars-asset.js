const { precompile } = require('handlebars');
const { Asset } = require('parcel-bundler');

class HbsAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = 'js';
  }

  async generate() {
    const { code: precompiled, map } = precompile(this.contents, { srcName: this.relativeName });
    const code = `import Handlebars from 'handlebars/dist/handlebars.runtime';
        const templateFunction = Handlebars.template(${precompiled});
        module.exports = templateFunction;`;

    this.sourceMap = JSON.parse(map);

    return [{
        type: 'js',
        value: code
    }];
  }
}

module.exports = HbsAsset;