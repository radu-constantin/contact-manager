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
}

export default new Model();