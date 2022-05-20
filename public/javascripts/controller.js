import model from "./model.js";
import view from "./views/view.js";

class Controller {
    async displayPage() {
        let contacts = await model.getAllContacts();
        
        view.renderSearch();
        view.renderContacts(contacts);
    }

    getIDfromButton(string) {
        return Number(string.split("_")[1]);
    }

    handleSubmit() {
        view.bindListener((event) => {
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

    init() {
        this.displayPage();
        this.handleSubmit();
    }
}

const app = new Controller();
app.init();

