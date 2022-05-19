class Model {
    constructor() {
        // this.contacts = this.getAllContacts();
    }
    
    getAllContacts() {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open("GET", "/api/contacts");
            request.responseType = 'json';
    
            request.addEventListener('load', () => {
                if (request.status === 200) {
                    resolve(request.response)
                } else {
                    reject({
                        status: request.status,
                        statusText: request.statusText,
                    });
                }
            });
            
            request.send();
        })
    }

    addContact(contactData) {
        let request = new XMLHttpRequest();
        request.open("POST", "/api/contacts/");
        request.setRequestHeader("Content-Type", "application/json")

        request.addEventListener("load", () => {
            if (request.status === 201) {
                alert("The contact was added succesfully!")
            } else {
                alert("The contact could not be added! \n" + request.response);
            }
        })

        request.send(contactData)
    }

    deleteContact(id) {
        let request = new XMLHttpRequest();
        request.open("DELETE", `/api/contacts/${id}`)

        request.addEventListener("load", () => {
            if (request.status === 204) {
                alert("The contact was deleted successfully!")
            } else {
                alert("The contact could not be deleted!");
            }
        })

        request.send();
    }
}

export default new Model();