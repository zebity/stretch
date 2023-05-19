// # Body Class Helper
// Usage: `{{volume_class}}`
//
// Output classes for the body element
const {SafeString} = require('../services/handlebars');
const {metaData} = require('../services/proxy');

const {getMetaDataUrl} = metaData;

// We use the name volume_class to match the helper for consistency
module.exports = function volume_class(options) { // eslint-disable-line camelcase
    let classes = [];
    const context = options.data.root.context || [];
    const obj = this.post || this.page;
    const tags = obj && obj.tags ? obj.tags : [];
    const isPage = !!(this.page);
    let top = false;

    let outputUrl = getMetaDataUrl(this, false);
    let vd = options.data.custom.volume_details;

    if (outputUrl == '/') {
      // main page
      top = true;
    } else {
      let ubits = outputUrl.split('/');
      let arr = JSON.parse(vd);

      if (arr != null && arr != undefined) {
        for (i = 0; i < arr.length; i++) {
          if (arr[i][0] === ubits[1]) {
            top = ubits.length === 3;
            // top level would be: ubits[0] = '/' ubits[1] = vol ubits[2] = '/'
            break;
          }
        }
      }
    }

    if (context.includes('home') || top) {
        classes.push('home-template');
    } else if (context.includes('post') && obj && !isPage) {
        classes.push('post-template');
    } else if (context.includes('page') && obj && isPage) {
        classes.push('page-template');
        classes.push(`page-${obj.slug}`);
    } else if (context.includes('tag') && this.tag) {
        classes.push('tag-template');
        classes.push(`tag-${this.tag.slug}`);
    } else if (context.includes('author') && this.author) {
        classes.push('author-template');
        classes.push(`author-${this.author.slug}`);
    } else if (context.includes('private')) {
        classes.push('private-template');
    }

    if (tags) {
        classes = classes.concat(
            tags.map(({slug}) => `tag-${slug}`)
        );
    }

    if (context.includes('paged')) {
        classes.push('paged');
    }

    classes = classes.join(' ').trim();

    return new SafeString(classes);
};
