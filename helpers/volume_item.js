// # Get a volume item from json array of strings ["route", "title", "description"]
// Usage: '{{volumes_item item [, logo-class, title-class]}}'
//          item - t[title] | d[description] | u[rl] | l[ogo] | in[image element nav] | ic[image element cover]
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
  let DEBUG = false;
  let i = 0;
  let error = null;
  let outputUrl = getMetaDataUrl(this, false);
  let na = arguments.length;
  let other = arguments[na - 1];
  let vd = other.data.custom.volume_details;
  let mt = other.data.site.title;
  let md = other.data.site.description;
  let lc = null;
  let tc = null;
  let l = null;
  let t = null;

  if (na > 3) {
    lc = arguments[1];
    tc = arguments[2];
  }

  if (outputUrl == '/') {
    // main page
    switch (type) {
      case 't': res = new SafeString(mt);
                break;
      case 'd': if (DEBUG) {
                  let j = JSON.stringify(other.data.root.context);
                  res = new SafeString(j);
                } else {
                  res = new SafeString(md);
                }
                break;
      case 'u': res = new SafeString(outputUrl);
                break;
      case 'l': res = other.data.site.logo;
                break;
      case 'ic': l = other.data.site.logo;
                 if (lc != null) {
                   if (l === null || l === undefined) {
                     res = new SafeString(`<h1 class="${tc}">${mt}</h1>`);
                   } else {
                     res = new SafeString(`<img class="${lc}" src="${l}" alt="${mt}">`);
                   }
                 } else {
                   res = new SafeString('ERR>> volume_item ic == cover image with no class.');    
                 }
                 break;
      case 'in': l = other.data.site.logo;
                 if (l === null || l === undefined) {
                   res = new SafeString(mt);
                 } else {
                   res = new SafeString(`<img src="${l}" alt="${mt}">`);
                 }
                 break;
      default: /* error = new errors.IncorrectUsageError({
                    message: `ERR>> volume_item - invalid type: "${type}"`,
                    err: err}); */
               res = new SafeString(`ERR>> volume_item - main, invalid type: "${type}"`);
    }
  } else {
    let urlbits = outputUrl.split('/');
    let arr = JSON.parse(vd);
    let logo = ['volumeii_logo','volumeiii_logo','volumeiv_logo','volumev_logo'];

    res = new SafeString(urlbits[1]);
    if (arr != null && arr != undefined) {
      for (i = 0; i < arr.length; i++) {
        if (arr[i][0] === urlbits[1]) {
          switch (type) {
            case 't': res = new SafeString(arr[i][1]);
                      break;
            case 'd': if (DEBUG) {
                        let j = JSON.stringify(other.data.root.context);
                        res = new SafeString(j);
                        // res = new SafeString(`volume_details: "${vd}"`);
                      } else {
                        res = new SafeString(arr[i][2]);
                      }
                      break;
            case 'u': res = new SafeString(`/${urlbits[1]}/`);
                      break;
            case 'l': res = other.data.custom[logo[i]];
                      break;
            case 'ic': l = other.data.custom[logo[i]];
                       t = arr[i][1];
                       if (lc != null) {
                         if (l === null || l === undefined) {
                           res = new SafeString(`<h1 class="${tc}">${mt}</h1>`);
                         } else {
                           res = new SafeString(`<img class="${lc}" src="${l}" alt="${mt}">`);
                         }
                       } else {
                         res = new SafeString('ERR>> volume_item ic == cover image with no class.');    
                       }
                       break;
            case 'in': l = other.data.custom[logo[i]];
                       t = arr[i][1];
                       if (l === null || l === undefined) {
                         res = new SafeString(t);
                       } else {
                         res = new SafeString(`<img src="${l}" alt="${t}">`);
                       }
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
