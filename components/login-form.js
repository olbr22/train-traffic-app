import authorization from "../models/authorization.js";

export default class LoginForm extends HTMLElement {
    constructor() {
        super();

        this.credentials = {};
    }

    async login() {
        const result = await authorization.login(
            this.credentials.email,
            this.credentials.password,
        );

        if (result === 'ok') {
            alert("Du är inloggad!");
            location.hash = "";
        }
    }

    async register() {
        const result = await authorization.register(
            this.credentials.email,
            this.credentials.password,
        );

        if (result === 'ok') {
            alert("Du är registrerad");
            this.login();
            // alert("..och inloggad!");
        } else {
            alert("Du kan inte registreras! Testa ändra användarnamn eller lösenord.");
        }
    }

    connectedCallback() {
        let form = document.createElement("form");

        form.classList.add("login-form");

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            this.login();
        });

        let usernameLabel = document.createElement("label");

        usernameLabel.classList.add("input-label");
        usernameLabel.textContent = "Användarnamn";

        let username = document.createElement("input");

        username.setAttribute("type", "email");
        username.setAttribute("required", "required");
        username.classList.add("input");

        username.addEventListener("input", (event) => {
            this.credentials = {
                ...this.credentials,
                email: event.target.value,
            };
        });

        let passwordLabel = document.createElement("label");

        passwordLabel.classList.add("input-label");
        passwordLabel.textContent = "Lösenord";

        let password = document.createElement("input");

        password.setAttribute("type", "password");
        password.setAttribute("required", "required");
        password.classList.add("input");

        password.addEventListener("input", (event)=> {
            this.credentials = {
                ...this.credentials,
                password: event.target.value,
            };
        });

        let submitButton = document.createElement("input");

        submitButton.setAttribute("type", "submit");
        submitButton.setAttribute("value", "Logga in");
        submitButton.classList.add("button", "full-width-button");

        let registerButton = document.createElement("input");

        registerButton.setAttribute("type", "button");
        registerButton.setAttribute("value", "Registrera");
        registerButton.classList.add("button", "full-width-button");

        registerButton.addEventListener("click", () => {
            this.register();
        });

        const formGroup = document.createElement("div");

        formGroup.classList.add("form-group");

        formGroup.appendChild(usernameLabel);
        formGroup.appendChild(username);

        formGroup.appendChild(passwordLabel);
        formGroup.appendChild(password);

        form.appendChild(formGroup);
        form.appendChild(submitButton);
        form.appendChild(registerButton);

        this.appendChild(form);
    }
}
