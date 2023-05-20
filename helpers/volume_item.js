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
  let context = other.data.root.context || [];
  let vd = other.data.custom.volume_details;
  let mt = other.data.site.title;
  let md = other.data.site.description;
  let t = null;
  let d = null;
  let u = null;
  let l = null;
  let tc = null;
  let lc = null;

  if (na > 3) {
    lc = arguments[1];
    tc = arguments[2];
  }

  if (context.includes('home')) {
    t = mt;
    d = md;
    u = outputUrl;
    l = other.data.site.logo;
  } else if (context.includes('tag') && this.tag) {
    t = mt;
    d = md;
    u = '/';
    l = other.data.site.logo;
  } else if (context.includes('author') && this.author) {
    t = mt;
    d = md;
    u = '/';
    l = other.data.site.logo;
  } else {

    let ubits = outputUrl.split('/');
    let arr = JSON.parse(vd);
    let logo = ['volumeii_logo','volumeiii_logo','volumeiv_logo','volumev_logo'];

    if (arr != null && arr != undefined) {
      for (i = 0; i < arr.length; i++) {
        if (arr[i][0] === ubits[1]) {
          t = arr[i][1];
          d = arr[i][2];
          u = `/${ubits[1]}/`;
          l = other.data.custom[logo[i]];
          break;
        }
      }
      if (t == null && context.includes('post')) {
        // Not a sub-subvolume post so must be main...
        t = mt;
        d = md;
        u = '/';
        l = other.data.site.logo;
      }
    }
  }

  if (DEBUG) {
    console.log(JSON.stringify(context, null, 2));
    console.log(`t: "${t}" d: "${d}" u: "${u}" l: "${l}"`);
  }

  if (t === null || t === undefined) {
    res = new SafeString('ERR>> volume_item - null/undefined title');
  } else {

    switch (type) {
      case 't': res = new SafeString(t);
                break;
      case 'd': if (DEBUG) {
                  let j = JSON.stringify(other.data.root.context);
                  res = new SafeString(j);
                   // res = new SafeString(`volume_details: "${vd}"`);
                 } else {
                   res = new SafeString(d);
                 }
                 break;
      case 'u': res = new SafeString(u);
                break;
      case 'l': res = l;
                break;
      case 'ic': if (lc != null) {
                   if (l === null || l === undefined) {
                     res = new SafeString(`<h1 class="${tc}">${t}</h1>`);
                   } else {
                     res = new SafeString(`<img class="${lc}" src="${l}" alt="${t}">`);
                   }
                  } else {
                    res = new SafeString('ERR>> volume_item ic == cover image with no class.');    
                  }
                  break;
      case 'in': if (l === null || l === undefined) {
                    res = new SafeString(t);
                  } else {
                    res = new SafeString(`<img src="${l}" alt="${t}">`);
                  }
                  break;
      default: /* error = new errors.IncorrectUsageError({
                    message: `ERR>> volume_item - invalid type: "${type}"`,
                    err: err}); */
               res = new SafeString(`ERR>> volume_item - main, invalid type: "${type}"`);
    }
  }

  if (error != null) {
    sentry.captureException(error);
    logging.error(error);
  }

  return res;
};
