class View {
    constructor() {
        this.search = document.querySelector("#search");
        this.addContactBtn = document.querySelector("#add_contact_btn");
        this.contactList = document.querySelector("#contact-list");
        this.main = document.querySelector("main");

        this.contactTemplate = Handlebars.compile(document.querySelector("#contact_template").innerHTML);
        this.formTemplate = Handlebars.compile(document.querySelector("#form_template").innerHTML);
    }

    render(contacts) {
        contacts.forEach(contact => {
            this.contactList.insertAdjacentHTML("beforeend", this.contactTemplate(contact));
        })
    }

    addListener() {
        this.addContactBtn.addEventListener('click', () => {
            this.contactList.style.display = 'none';
            this.main.insertAdjacentHTML("beforeend", this.formTemplate());
        })
    }
}

export default new View();