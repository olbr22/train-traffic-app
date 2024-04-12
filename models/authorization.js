import { apiKey, baseURL } from "../utils.js";

const authorization = {
    token: null,
    // set token when get token back

    login: async function login(email, password) {
        const user = {
            email: email,
            password: password,
            api_key: apiKey
        };
        const response = await fetch(`${baseURL}/login`,
            {
                body: JSON.stringify(user),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST'
            });

        const result = await response.json();

        if ("errors" in result) {
            return result.errors.detail;
        } else {
            authorization.token = result.data.token;
            // console.info("Token: ", authorization.token);
            return "ok";
        }
    },

    register: async function register(email, password) {
        const user = {
            email: email,
            password: password,
            api_key: apiKey
        };
        const response = await fetch(`${baseURL}/register`,
            {
                body: JSON.stringify(user),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST'
            });

        const result = await response.json();

        console.info("Register", result.data);

        if (result.data.message === "User successfully registered.") {
            return "ok";
        }
        return "not ok";
    },
};

export default authorization;
