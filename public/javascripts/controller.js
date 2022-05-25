import model from "./model.js";
import view from "./views/view.js";

class Controller {
    constructor() {
        this.contacts = null;
        this.tags = [];
        this.selectedTags = [];
    }

    async displayPage() {
        view.renderSearch();
        this.refreshContacts().then(() => {
            view.renderTagList(this.tags);
            view.renderContacts(this.contacts);
        })

    }

    async refreshContacts() {
        this.contacts = await model.getAllContacts();
        this.contacts.forEach(contact => {
            if (contact.tags) {
                contact.tags.split(",").forEach(tag => this.tags.push(tag));
            }
        })
        this.tags = Array.from(new Set(this.tags));
        this.tags = this.tags.map(element => {
            let obj = {'tag': element};
            return obj;
        });
    }

    getIDfromButton(string) {
        return Number(string.split("_")[1]);
    }

    handleSubmit() {
        view.bindBodyListener((event) => {
            if (event.target.id === "add_contact_btn") {
                view.renderForm();
            } else if (event.target.id.includes("edit")) {
                let id = this.getIDfromButton(event.target.id);
                model.getContact(id).then(contactObj => view.renderForm(contactObj));
            } else if (event.target.id === "submit_form") {
                let formID = Number(view.getFormID());
                if (formID) {
                    model.editContact(formID, view.getFormData());
                    this.displayPage();
                } else {
                    model.addContact(view.getFormData());
                    this.displayPage();
                }
            } else if (event.target.id.includes("delete")) {
                alert("Are you sure you want to delete this contact?")
                model.deleteContact(this.getIDfromButton(event.target.id));
                view.resetView();
                this.displayPage();
            } else if (event.target.className === "tag-selector") {
                this.handleTagFilter(event.target);
            }
        })
    }

    handleTagFilter(target) {
        let tag = target.textContent;
        if (target.classList.contains("selected")) {
            target.classList.remove("selected");
            this.displayPage();
        } else {
            target.classList.add("selected");
            let filteredContacts = this.filterContactsByTag(this.contacts, tag);
            view.filterContacts(filteredContacts);
        }
        
    }

    filterContactsByName(contacts, input) {
        return contacts.filter(contact => {
            return contact.full_name.toLowerCase().startsWith(input);
        })
    }

    filterContactsByTag(contacts, tag) {
        return contacts.filter(contact => {
            if (contact.tags) {
                console.log(tag);
                return contact.tags.includes(tag);
            }
        })
    }

    handleSearch() {
        view.bindSearchListener(() => {
            let input = view.getSearchInput();
            let filteredContacts = this.filterContactsByName(this.contacts, input);
            view.filterContacts(filteredContacts);
        })
    }

    init() {
        this.displayPage();
        this.handleSubmit();
        this.handleSearch();
    }
}

const app = new Controller();
app.init();

