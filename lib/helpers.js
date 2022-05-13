const CONTACT_ATTRS = ['full_name', 'phone_number', 'email', 'tags'];

module.exports = {
  extractContactAttrs: function(body) {
    let returnObj = {};
    Object.keys(body).forEach(function(key) {
      if (CONTACT_ATTRS.includes(key)) returnObj[key] = body[key];
    });

    return returnObj;
  }
}
