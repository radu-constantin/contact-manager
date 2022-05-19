class View {
    constructor() {
        this.body = document.querySelector("body");
        this.search = document.querySelector("#search");
        this.addContactBtn = document.querySelector("#add_contact_btn");
        this.contactList = document.querySelector("#contact-list");
        this.main = document.querySelector("main");

        this.contactTemplate = Handlebars.compile(document.querySelector("#contact_template").innerHTML);
        this.formTemplate = Handlebars.compile(document.querySelector("#form_template").innerHTML);
        this.searchTemplate = Handlebars.compile(document.querySelector("#search_template").innerHTML);
    }

    resetView() {
        while (this.main.lastChild) {
            this.main.removeChild(this.main.lastChild);
        }
    }

    renderSearch() {
        this.main.insertAdjacentHTML("beforeend", this.searchTemplate());
    }

    renderContacts(contacts) {
        let contactsContainer = document.createElement('section');
        contactsContainer.classList.add('container');
        contactsContainer.id = "contact-list";

        contacts.forEach(contact => {
            contactsContainer.insertAdjacentHTML("beforeend", this.contactTemplate(contact));
        })

        this.main.insertAdjacentElement("beforeend", contactsContainer);
    }

    renderForm() {
        this.resetView();
        this.main.insertAdjacentHTML("beforeend", this.formTemplate());
    }

    getFormData() {
        let data = new FormData(document.querySelector('form'));
        let json = {}
        for (let pair of data.entries()) {
            json[pair[0]] = pair[1]; 
        }

        return JSON.stringify(json);
    }

    bindListener(callback) {
        this.body.addEventListener('click', callback);
    }


}

export default new View();