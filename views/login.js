export default class LoginView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML = `
        <login-form></login-form>
        `;
    }
}
