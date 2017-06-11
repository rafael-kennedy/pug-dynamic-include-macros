const fs = require('fs')

// {
//   directories: [
//     {
//       name:'emp',
//       directory: 'app/content/employers',
//       filter: ':markdown-it',
//       sortFunc: function(a,b) {
//         return a > b
//       }
//     }
//   ],
//   "mixinFileName": "_dynamicincludes.pug"
// }

module.exports = function (inObj) {
  let outStr = ""
  inObj.directories.forEach(v => {
    try {
      let topMixin = `
mixin ${v.name}`
      let files = fs.readdirSync(v.directory)
      if (v.hasOwnProperty('sortFunc')) {
        files = files.sort(v.sortFunc)
      }
      files.forEach((f, i) => {
        outStr += `
mixin ${v.name}${i}
  include${v.filter || ""} ${v.directory}${f}
        `
        topMixin += `
  include${v.filter || ""} ${v.directory}${f}
        `
      })
    outStr += topMixin
    } catch (e) {
      console.log(e)
    } finally {

    }
  })

  return new Promise((resolve, reject) => {
    fs.writeFile(inObj.mixinFileName, outStr, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
};
