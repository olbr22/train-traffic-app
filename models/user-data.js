import { apiKey, baseURL } from "../utils.js";
import authorization from "./authorization.js";

const userData = {
    token: async function getToken() {
        if (!authorization.token) {
            alert(
                "You need to be logged in to add a station to your favorites."
            );
            throw new Error("Authorization token not available.");
        }
        return authorization.token;
    },

    add: async function addStationToFavorites(station) {
        const userToken = await this.token();
        const data = {
            // Send the station object info as a string
            artefact: JSON.stringify(station),
            api_key: apiKey
        };
        // Create data for authenticated user
        const response = await fetch(`${baseURL}/data`,
            {
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': userToken
                },
                method: 'POST'
            });

        const result = await response.json();

        if ("errors" in result) {
            return result.errors.detail;
        } else {
            return result.data;
        }
    },

    remove: async function removeStationFromFavorites(id) {
        const userToken = await this.token();
        const data = {
            id: id,
            api_key: apiKey
        };
        const response = await fetch(`${baseURL}/data`,
            {
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': userToken
                },
                method: 'DELETE'
            });

        const result = response;

        if (result.ok) {
            return "ok";
        } else {
            return result;
        }
    },

    get: async function getUserData() {
        const userToken = await this.token();
        const response = await fetch(`${baseURL}/data?api_key=${apiKey}`,
            {
                headers: {
                    'x-access-token': userToken
                },
                method: 'GET'
            });

        const result = await response.json();

        return result.data;
    },
};

export default userData;
