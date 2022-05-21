class View {
    constructor() {
        this.body = document.querySelector("body");
        this.addContactBtn = document.querySelector("#add_contact_btn");
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

    filterContacts(contacts) {
        let contactList = document.querySelector("#contact-list");
        contactList.innerHTML = "";
        if (contacts.length > 0) {
            contacts.forEach(contact => {
                contactList.insertAdjacentHTML("beforeend", this.contactTemplate(contact));
            })
        } else {
            
        }
       
    }

    renderForm(contact) {
        this.resetView();
        this.main.insertAdjacentHTML("beforeend", this.formTemplate(contact));
    }

    getFormData() {
        let data = new FormData(document.querySelector('form'));
        let json = {}
        for (let pair of data.entries()) {
            json[pair[0]] = pair[1]; 
        }

        return JSON.stringify(json);
    }

    bindBodyListener(callback) {
        this.body.addEventListener('click', callback);
    }

    bindSearchListener(callback) {
        let inputBox = document.querySelector("#search input");
        inputBox.addEventListener('keyup', callback);
    }

    getFormID() {
        let form = document.querySelector("form");
        return form.id;
    }

    getSearchInput() {
        let inputBox = document.querySelector("#search input");
        return inputBox.value;
    }
}

export default new View();