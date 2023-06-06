// # Test to the number number: main|i|1 or ii|2, iii|3, iv|4, v|5
// Usage: '{{#if_volume vol}}'
//
// Returns true or false
//

const {metaData} = require('../services/proxy');
const {SafeString} = require('../services/handlebars');
const _ = require('lodash');

const {getMetaDataUrl} = metaData;

module.exports = function if_volume(...attrs) {
  let res = false;
  let i = 0;
  let DEBUG = false;
  const options = attrs.pop();
  const isBlock = _.has(options, 'fn');

  if (DEBUG) {

    let props = "|";
    for (p in options)
      props += `${p}|`;

    console.log(props);
    console.log(JSON.stringify(options, null, 2)); 
  }

  if (_.isEmpty(attrs)) {
    // Just return false
  } else if (attrs.length <= 2) {

    let vd = options.data.custom.volume_details;
    let tst = attrs[0];
    let logo = null;
    let outputUrl = getMetaDataUrl(this, false);
    if (attrs.length === 2) {
      logo = attrs[1];
    }

    if (outputUrl == '/') {
      // main page
      if (tst === 0) {
        res = true;
      } else {
        res = tst === 1 || tst === 'main' || tst === 'i';
      }
    } else {
      let ubits = outputUrl.split('/');
      let arr = JSON.parse(vd);

      if (DEBUG) {
        let no_logos = arr.length;
        let logos = [[options.data.custom.volumeii_logo, "volume ii"],
                     [options.data.custom.volumeiii_logo, "volume iii"],
                     [options.data.custom.volumeiv_logo, "volume iv"],
                     [options.data.custom.volumev_logo, "volume v"]];

        if (arr != null && arr != undefined) {
          for (i = 0; i < no_logos; i++) {
            if (logos[i][0] === null || logos[i][0].length < 1) {
              console.log(`ERR>> No logo defined for volume: ${logo[i][1]}.`); 
            }
          }
          for (i = 0; i < arr.length; i++) {
            if (arr[i].length != 3) {
              console.log(`ERR>> Invalid Volume Details(${i}): ${arr[i]}`);
            }
          }
        }
      }

      if (tst > 10)
        tst -= 10;

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
