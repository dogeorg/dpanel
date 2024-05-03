import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';
import { asyncTimeout } from '/utils/timeout.js';
import { postLogin } from '/api/login/login.js';

class LoginView extends LitElement {

  static styles = css`
    .padded {
      padding: 20px;
    }
    h1 {
      font-family: 'Comic Neue', sans-serif;
    }
  `

  static get properties() {
    return {
      _server_fault: { type: Boolean },
      _invalid_creds: { type: Boolean }
    }
  }

  constructor() {
    super();
    this._server_fault = false;
    this._invalid_creds = false;
    this.loginFields = {
      sections: [
        {
          name: 'login',
          submitLabel: 'Login',
          fields: [{
            name: 'password',
            label: 'Enter Password',
            type: 'password',
            placeholder: 'SuchDefault',
            passwordToggle: true
          }]
        }
      ]
    }
  }

  attemptLogin = async (data, form, dynamicFormInstance) => {
    // Do a thing
    const loginResponse = await postLogin(data)
      .catch(loginFault => this.handleFault);
    
    if (!loginResponse) {
      dynamicFormInstance.retainChanges(); // stops spinner
      return;
    }

    // Credential error
    if (loginResponse.error) {
      dynamicFormInstance.retainChanges(); // stops spinner
      this.handleError(loginResponse.error);
      return;
    }

    if (!loginResponse.token) {
      dynamicFormInstance.retainChanges(); // stops spinner
      this.handleError('MISSING-TOKEN');
      return;
    }

    // Credential success
    if (loginResponse.token) {
      dynamicFormInstance.retainChanges(); // stops spinner
      this.handleSuccess();
      return;
    }
  }

  handleFault(loginFault) {
    this._server_fault = true;
    console.warn(loginFault);
    window.alert('boo. something went wrong')
  }

  handleError(loginResponseError) {
    switch(loginResponseError) {
      case 'CHECK-CREDS':
        this._invalid_creds = true;
        break;
      case 'MISSING-TOKEN':
        this.handleFault({ error: loginResponseError });
        break;
      default: 
        this.handleFault({ unhandledError: loginResponseError });
    }
  }

  handleSuccess() {
    window.alert('Party party yeah');
    
    // navigate to destination
    // ...
  }

  render() {
    return html`
      <div class="padded">
        <h1>Such Login</h1>
        <dynamic-form
          .fields=${this.loginFields}
          .onSubmit=${this.attemptLogin}
          requireCommit
        >
        </dynamic-form>
      </div>
    `;
  }
}

customElements.define('login-view', LoginView);


