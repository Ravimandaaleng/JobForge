import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api"
});

/*
    Add JWT token to every request
*/
api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


/*
    Handle API errors globally
*/
api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        if (!error.response) {
            console.error(
                "Network Error: Backend may be offline."
            );

            return Promise.reject(error);
        }

        const status = error.response.status;

        if (status === 401) {

            console.error(
                "401: Authentication required"
            );

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/login";
        }

        if (status === 403) {

            console.error(
                "403: Access denied"
            );
        }

        if (status === 404) {

            console.error(
                "404: Resource not found"
            );
        }

        if (status >= 500) {

            console.error(
                "Server Error: Please try again later."
            );
        }

        return Promise.reject(error);
    }
);

export default api;