import model from "./model.js";
import view from "./views/view.js";

class Controller {
    constructor() {
        this.activeFilters = [];
        this.filteredContacts = null;

        this.refreshContacts();
        this.self = this;

        this.bindListeners();      
    }

    bindListeners() {
        view.bindSubmitNewContact(this.handleSubmitNewContact.bind(this.self));
        view.bindAddContact(this.handleAddButton);
        view.bindContactActions(this.handleContactActions.bind(this.self));
        view.bindTagFilter(this.handleTagFilter.bind(this.self));
        view.bindSearchFilter(this.handleSearch.bind(this.self));
    }

    async refreshContacts() {
        model.contacts = await model.getAllContacts();
        model.tags = this.getTags();

        this.resetTagFilters();
        view.displayContacts(this.filteredContacts);
        view.displayTags(model.tags);
    }

    getTags() {
        let tags = [];
        model.contacts.forEach(contact => {
            if (contact.tags) {
                contact.tags.split(",").forEach(tag => {
                    if (!tags.includes(tag)) {
                        tags.push(tag);
                    }
                })
            }
        })
        return tags.map(element => {
            return {'tag': element};
        })
    }

    handleAddButton() {
        view.displayForm();
    }

    handleSubmitNewContact(event) {
        if (event.target.id === "submit_form") {
            event.preventDefault();
            let id = view.getFormID();
            if (id) {
                model.editContact(id, view.getFormData());
            } else {
                model.addContact(view.getFormData());
            }
            view.resetUI();
            view.resetSearchInput();
            this.refreshContacts();
        } else if (event.target.id === "cancel_btn") {
            event.preventDefault();
            view.resetUI();
        }
    }

    getIDfromButton(string) {
        return Number(string.split("_")[1]);
    }

    handleTagFilter(event) {
        let target = event.target;
        if (target.tagName === "BUTTON") {
            let tag = target.textContent;
            if (target.classList.contains("selected")) {
                target.classList.remove("selected");
                this.activeFilters.splice(this.activeFilters.indexOf(tag), 1);
            } else {
                target.classList.add("selected");
                this.activeFilters.push(tag);
            }
            this.filteredContacts = this.filterContactsByTag(model.contacts, this.activeFilters)
            view.displayContacts(this.filteredContacts);
        }
    }

    handleSearch(event) {
        let searchResults = this.filterContactsByName(this.filteredContacts, event.target.value);
        view.displayContacts(searchResults);
    }

    resetTagFilters() {
        this.activeFilters = [];
        this.filteredContacts = model.contacts;
    }

    async deleteContact(event) {
        event.preventDefault();

        let id = this.getIDfromButton(event.target.id);

        await model.deleteContact(id);
        this.refreshContacts();
        view.resetSearchInput();
    }

    async handleContactActions(event) { //Handles the option to delete or edit a contact.
        if  (event.target.id.includes("delete")) {
            this.deleteContact(event);
        } else if (event.target.id.includes("edit")) {
            let id = this.getIDfromButton(event.target.id);
            event.preventDefault();
            let contact = await model.getContact(id);
            view.displayForm(contact);
        }
    };

    filterContactsByTag(contacts, tags) {
        if (tags.length === 0) return model.contacts;
        let filtered = contacts.filter(contact => {
            if (contact.tags) {
                let contactTags = contact.tags.split(",");
                return tags.every(tag => {
                    return contactTags.includes(tag);
                })
            }
        })
        return filtered
    };

    filterContactsByName(contacts, input) {
        return contacts.filter(contact => {
            return contact.full_name.toLowerCase().startsWith(input);
        })
    };
}

const app = new Controller();