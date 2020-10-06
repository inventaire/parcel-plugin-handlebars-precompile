const partialPattern = /\{\{partial ('|")([\w:_]+)('|")/g

const getPartialsNames = templateText => {
  const partialsMatches = templateText.matchAll(partialPattern)
  return Array.from(partialsMatches).map(match => match[2])
}

// Based on https://github.com/inventaire/inventaire-client/blob/master/app/lib/handlebars_helpers/partials.js
const getPartialPath = name => {
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

  if (subfolder != null) {
    return `modules/${module}/views/${subfolder}/templates/${file}.hbs`
  } else {
    return `modules/${module}/views/templates/${file}.hbs`
  }
}

module.exports = contents => getPartialsNames(contents).map(getPartialPath)
