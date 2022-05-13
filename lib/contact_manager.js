const fs = require('fs');
const path = require('path');
const stringify = require('json-beautify');

let dataFile = 'contacts.json';
if (process.env.NODE_ENV === 'test') dataFile = 'contacts_test.json';
const DATA_PATH = path.join(__dirname, `../data/${dataFile}`);

const contactManager = {
  getAll: function(cb) {
    let data = fs.readFileSync(DATA_PATH, 'utf-8');
    let collection = data.trim().length > 0 ? JSON.parse(data) : [];
    return collection;
  },

  get: function(contactId) {
    contactId = Number(contactId);
    let collection = this.getAll();

    if (collection.map(c => c.id).includes(contactId)) {
      return collection.find(c => c.id === contactId);
    } else {
      return false;
    }
  },

  add: function(contact) {
    if (!contact['full_name']) return false;
    let collection = this.getAll();
    let newContact = this.createContact(contact);

    collection.push(newContact);
    this.write(collection);

    return newContact;
  },

  remove: function(contactId) {
    contactId = Number(contactId);
    let collection = this.getAll();
    let newCollection;
    if (collection.map(c => c.id).includes(contactId)) {
      newCollection = collection.filter(contact => contact.id !== contactId);
      this.write(newCollection);
      return true;
    } else {
      return false;
    }
  },

  update: function(contactId, contactAttrs) {
    contactId = Number(contactId);
    let collection = this.getAll();
    let newCollection;
    let updatedContact;
    if (collection.map(c => c.id).includes(contactId)) {
      newCollection = collection.map(function(contact) {
        if (contact.id === contactId) {
          updatedContact = Object.assign({}, contact, contactAttrs);
          return updatedContact;
        }
        return contact;
      });
      this.write(newCollection);
      return updatedContact;
    } else {
      return false;
    }
  },

  generateId: function() {
    let collection = this.getAll();

    var maxId = collection.reduce(function(prevMax, contact) {
      return contact.id > prevMax ? contact.id : prevMax;
    }, 0);

    return maxId + 1;
  },

  write: function(collection) {
    fs.writeFileSync(DATA_PATH, stringify(collection, null, 2));
  },

  removeAll: function() {
    this.write([]);
  },

  createContact: function(contact) {
    let newContact = Object.assign(
      {
        full_name: null,
        phone_number: null,
        email: null,
        tags: null
      },
      { id: this.generateId() },
      contact
    );
    return newContact;
  }
};
module.exports = contactManager;
