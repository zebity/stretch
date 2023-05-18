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

module.exports = function volume_item(type) {
  let res = new SafeString("");
  let i = 0;
  let error = null;
  let outputUrl = getMetaDataUrl(this, false);
  let na = arguments.length;
  let other = arguments[na - 1];
  // let vd = other.proprtyLookup(other, "data/custom/volume_details");
  // let vd = other.proprtyLookup.data.custom;
  let vd = other.data.custom.volume_details;
  let mt = other.data.site.title;
  let md = other.data.site.description;

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
    let arr = JSON.parse(vd);

    res = new SafeString(urlbits[1]);
    if (arr != null && arr != undefined) {
      for (i = 0; i < arr.length; i++) {
        if (arr[i][0] === urlbits[1]) {
          switch (type) {
            case 't': res = new SafeString(arr[i][1]);
                      break;
            case 'd': res = new SafeString(arr[i][2]);
                      /* let props = "";
                      for (let p in other) {
                        props = props + '|' + p;
                      }
                      // res = new SafeString(props + '|');
                      let j = JSON.stringify(other);
                      res = new SafeString(j);
                      res = new SafeString(`volume_details: "${vd}"`); */
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
