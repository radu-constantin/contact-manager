class View {
    constructor() {
        this.templates = {
            contactTemplate: Handlebars.compile(document.querySelector("#contact_template").innerHTML),
            formTemplate: Handlebars.compile(document.querySelector("#form_template").innerHTML),
            searchTemplate: Handlebars.compile(document.querySelector("#search_template").innerHTML),
            tagsTemplate: Handlebars.compile(document.querySelector("#tags_template").innerHTML),
        }

        this.main = document.querySelector("main");

        this.displayUI();
    }

    displayUI() {
        this.searchBar = this.initializeElement("section", "container", "search");
        this.contactList = this.initializeElement("section", "container", "contact_list");
        this.tagList = this.initializeElement("section", "container", "tag_list");
        this.form = this.initializeElement("section", "container", "contact_form");

        this.main.appendChild(this.searchBar);
        this.searchBar.innerHTML = this.templates.searchTemplate();

        this.main.appendChild(this.tagList);
        this.main.appendChild(this.contactList);
        this.main.appendChild(this.form);
        this.form.style.display = "none";
    }

    resetSearchInput() {
        this.searchBar.querySelector("input").value = "";
    }

    resetUI() {
        this.searchBar.style.display = "flex";
        this.contactList.style.display = "flex";
        this.tagList.style.display = "flex";      

        this.form.style.display = "none";
    }

    displayForm(contact) {
        this.hideUI();
        this.form.style.display = "flex";
    
        this.form.innerHTML = this.templates.formTemplate(contact);
 
    }

    hideUI() {
        this.form.style.display = "none";
        this.searchBar.style.display = "none";
        this.contactList.style.display = "none";
        this.tagList.style.display = "none";
    }

    displayContacts(contacts) {
        this.resetContacts();
        if (contacts.length === 0) {
            this.contactList.insertAdjacentHTML("beforeend", "<h2>There are no contacts with the selected criteria</h2>")
        } else {
            contacts.forEach(contact => {
                this.contactList.insertAdjacentHTML("beforeend", this.templates.contactTemplate(contact));
            })
        }
    }

    resetContacts() {
        while (this.contactList.lastChild) {
            this.contactList.removeChild(this.contactList.lastChild);
        }
    }

    displayTags(tags) {
        this.tagList.innerHTML = this.templates.tagsTemplate(tags);
    }

    bindAddContact(handler) {
        let button = this.searchBar.querySelector("button");
        button.addEventListener("click", handler);
    }

    bindSubmitNewContact(handler) {
        this.form.addEventListener("click", handler)
    }

    bindContactActions(handler) {
        this.contactList.addEventListener("click", handler);
    }

    bindTagFilter(handler) {
        this.tagList.addEventListener("click", handler);
    }

    bindSearchFilter(handler) {
        let inputBox = this.searchBar.querySelector("input");
        inputBox.addEventListener("keyup", handler);
    }

    initializeElement(tag, className, id) {
        let element = document.createElement(tag);
        if (className) element.classList.add(className);
        if (id) element.id = id;
        return element;
    }

    getFormData() {
        let data = new FormData(this.form.querySelector("form"));
        let json = {};
        for (let pair of data.entries()) {
            json[pair[0]] = pair[1]; 
        }

        return JSON.stringify(json);
    }

    getFormID() {
        let form = document.querySelector("form");
        return form.id;
    }
}

export default new View();