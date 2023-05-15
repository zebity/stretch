// # Test to the number number: main|i|1 or ii|2, iii|3, iv|4, v|5
// Usage: '{{#if_volume volsd vol}}'
//
// Returns true or false
//

const {metaData} = require('../services/proxy');
const {SafeString} = require('../services/handlebars');
const _ = require('lodash');

const {getMetaDataUrl} = metaData;

module.exports = function if_volume(...attrs) {
  // module.exports = function if_volume(volstd, tst) {
  const options = attrs.pop();
  const isBlock = _.has(options, 'fn');
 
  let res = false;
  let i = 0;

  if (_.isEmpty(attrs)) {
    // Just return false
  } else if (attrs.length === 2) {

    let volstd = attrs[0];
    let tst = attrs[1];
    let outputUrl = getMetaDataUrl(this, false);

    if (outputUrl == '/') {
      // main page
      if (tst === 0) {
        res = true;
      } else {
        res = tst === 1 || tst === 'main' || tst === 'i';
      }
    } else {
      let ubits = outputUrl.split('/');
      let arr = JSON.parse(volstd);

      if (arr != null && arr != undefined) {
        for (i = 0; i < arr.length; i++) {
          if (arr[i][0] === ubits[1]) {
            if (tst == 0) {
              res = ubits.length === 3;
              // top level would be: ubits[0] = '/' ubits[1] = vol ubits[2] = '/'
            } else {
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
            }
            break;
          }
        }
      }
    }

    if (isBlock) {
      if (res) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  }
  return res;
};
