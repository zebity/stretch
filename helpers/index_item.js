// # Get an item out of json array of strings
// Usage: '{{index_item striing=["one","two", "three" ..] item=0..n}}'
//
// Returns the index item used to save custom attributes 
//
const { SafeString } = require('../services/handlebars');

module.exports = function index_item(arrstr, idx) {
  let res = new SafeString(arrstr);

  if (idx >= 0) {
    let arr = JSON.parse(arrstr);

    if (arr != null && arr != undefined) {
      if (arr.length > idx) {
        res = new SafeString(arr[idx]);
      }
    }
  }
  return res;
};
