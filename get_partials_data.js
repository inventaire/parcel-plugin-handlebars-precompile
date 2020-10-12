const partialPattern = /\{\{> '([\w:_]+)'/g
const getImportName = name => `_${name.replace(/:/g, '_')}`

const getPartialsNames = templateText => {
  const partialsMatches = templateText.matchAll(partialPattern)
  const found = Array.from(partialsMatches).map(match => match[1])
  return uniq(found)
}

// Based on https://github.com/inventaire/inventaire-client/blob/master/app/lib/handlebars_helpers/partials.js
const addPartialPath = name => {
  const parts = name.split(':')
  let file, module, subfolder
  if (parts.length === 3) {
    // ex: partial 'general:menu:feedback_news'
    [ module, subfolder, file ] = parts
  } else if (parts.length === 2) {
    // ex: partial 'user:password_input'
    [ module, file ] = parts
  } else if (parts.length === 1) {
    // defaulting to general:partialName
    // ex: partial 'separator'
    [ module, file ] = [ 'general', name ]
  }

  let path
  if (subfolder != null) {
    path = `modules/${module}/views/${subfolder}/templates/${file}.hbs`
  } else {
    path = `modules/${module}/views/templates/${file}.hbs`
  }

  return {
    name,
    path,
    importName: getImportName(name)
  }
}

const uniq = array => Array.from(new Set(array))

module.exports = contents => getPartialsNames(contents).map(addPartialPath)
