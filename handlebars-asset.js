const { precompile } = require('handlebars');
const { Asset } = require('parcel-bundler');
const getPartialsData = require('./get_partials_data');

class HbsAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = 'js';
  }

  async generate() {
    const precompiled = precompile(this.contents);

    // inventaire-client hack: pre-import all {{partials}} to force Parcel to include them in the bundle
    // otherwise we get "Cannot resolve dependency" errors
    const partialsData = getPartialsData(this.contents)

    let partialsImports = ''
    let registerPartials = ''

    if (partialsData.length > 0) {
      partialsImports = partialsData
        .map(({ path, importName }) => `import ${importName} from '${path}';`)
        .join('\n')

      registerPartials = partialsData
        // .map({ path } => `window._antiTreeShake['${path}'] = ${slugifyPath(path)};`)
        .map(({ name, importName }) => {
          return `Handlebars.registerPartial('${name}', ${importName});`
        })
        .join('\n')
    }


    const code = `import Handlebars from 'handlebars/dist/handlebars.runtime';
        ${partialsImports}
        ${registerPartials}
        const templateFunction = Handlebars.template(${precompiled});
        export default templateFunction;`;

    return [{
        type: 'js',
        value: code
    }];
  }
}

module.exports = HbsAsset;