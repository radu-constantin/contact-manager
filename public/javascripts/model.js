class Model {
    constructor() {
        this.contacts = null;
        this.tags = null;
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

    getContact(id) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open("GET", `/api/contacts/${id}`);
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

    editContact(id, contactData) {
        contactData = JSON.parse(contactData);
        contactData["id"] = id;
        contactData = JSON.stringify(contactData);
        
        let request = new XMLHttpRequest();
        request.open("PUT", `/api/contacts/${id}`);
        request.setRequestHeader("Content-Type", "application/json")

        request.addEventListener("load", () => {
            if (request.status === 201) {
                alert("The contact was edited succesfully!")
            } else {
                alert("The contact could not be edited! \n" + request.response);
            }
        })

        request.send(contactData)
    }

    deleteContact(id) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open("DELETE", `/api/contacts/${id}`)

            request.addEventListener("load", () => {
                if (request.status === 204) {
                    resolve(request.response);
                }
            })

            request.send();
        });
    }
}

export default new Model();