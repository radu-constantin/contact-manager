import model from "./model.js";
import view from "./views/view.js";

class Controller {
    displayContacts() {
        model.getAllContacts().then(response => {
            console.log(response);
            console.log(Array.isArray(response));
            console.log(typeof response);
            view.render(response);
        })
    }

    init() {
        this.displayContacts();
        view.addListener();
    }
}

const app = new Controller();
app.init();

