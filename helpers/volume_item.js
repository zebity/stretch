// # Get a volume item from json array of strings ["route", "title", "description"]
// Usage: '{{volumes_item string=[["route", "title", "description"],...] item}}'
//
// Returns the volume item based on page 
//

const {metaData} = require('../services/proxy');
const {SafeString} = require('../services/handlebars');
const logging = require('@tryghost/logging');
const sentry = require('../../shared/sentry');
const errors = require('@tryghost/errors');

const {getMetaDataUrl} = metaData;

module.exports = function volume_item(mt, md, volstd, type) {
  let res = new SafeString(volstd);
  let i = 0;
  let error = null;
  let outputUrl = getMetaDataUrl(this, false);


  if (outputUrl == '/') {
    // main page
    switch (type) {
      case 't': res = new SafeString(mt);
                break;
      case 'd': res = new SafeString(md);
                break;
      case 'u': res = new SafeString(outputUrl);
                break;
      default: /* error = new errors.IncorrectUsageError({
                    message: `ERR>> volume_item - invalid type: "${type}"`,
                    err: err}); */
               res = new SafeString(`ERR>> volume_item - main, invalid type: "${type}"`);
    }
  } else {
    let urlbits = outputUrl.split('/');
    let arr = JSON.parse(volstd);

    res = new SafeString(urlbits[1]);
    if (arr != null && arr != undefined) {
      for (i = 0; i < arr.length; i++) {
        if (arr[i][0] === urlbits[1]) {
          switch (type) {
            case 't': res = new SafeString(arr[i][1]);
                      break;
            case 'd': res = new SafeString(arr[i][2]);
                      break;
            case 'u': res = new SafeString(`/${urlbits[1]}/`);
                      break;
            default: /* error = new errors.IncorrectUsageError({
                       message: `ERR>> volume_item - invalid type: "${type}"`,
                       err: err}); */
                       res = new SafeString(`ERR>> volume_item - invalid type: "${type}"`);
          }
          break;
        }
      }
    }
  }

  if (error != null) {
    sentry.captureException(error);
    logging.error(error);
  }

  return res;
};
