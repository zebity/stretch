// # Test to the number number: main|i|1 or ii|2, iii|3, iv|4, v|5
// Usage: '{{#if_volume volsd vol}}'
//
// Returns true or false
//

const {metaData} = require('../services/proxy');
const {SafeString} = require('../services/handlebars');

const {getMetaDataUrl} = metaData;

module.exports = function if_volume(volstd, tst) {
  let res = false;
  let i = 0;
  let outputUrl = getMetaDataUrl(this, false);


  if (outputUrl == '/') {
    // main page
    res = tst === 1 || tst === 'main' || tst === 'i';
  } else {
    let urlbits = outputUrl.split('/');
    let arr = JSON.parse(volstd);

    if (arr != null && arr != undefined) {
      for (i = 0; i < arr.length; i++) {
        if (arr[i][0] === urlbits[1]) {
          switch (i) {
            case 0: res = tst === 2 || tst === 'ii';
                    break;
            case 1: res = tst === 3 || tst === 'iii';
                    break;
            case 2: res = tst === 4 || tst === 'iv';
                    break;
            case 3: res = tst === 5 || tst === 'v';
                    break;
          }
          break;
        }
      }
    }
  }

  return res;
};
