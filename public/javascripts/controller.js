import model from "./model.js";
import view from "./views/view.js";

class Controller {
    constructor() {
        this.contacts = null;
    }

    async displayPage() {
        view.renderSearch();
        await this.refreshContacts();
        view.renderContacts(this.contacts);
    }

    async refreshContacts() {
        this.contacts = await model.getAllContacts();
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
            }
        })
    }

    filterContacts(contacts, input) {
        return contacts.filter(contact => {
            return contact.full_name.toLowerCase().startsWith(input);
        })
    }

    handleSearch() {
        view.bindSearchListener(event => {
            let input = view.getSearchInput();
            let filteredContacts = this.filterContacts(this.contacts, input);
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

