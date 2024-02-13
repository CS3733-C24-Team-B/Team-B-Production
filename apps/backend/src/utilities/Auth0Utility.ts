import axios from "axios";

class Auth0Utility {

    private readonly client_id: string;
    private readonly client_secret: string;
    private readonly audience: string;
    private token: string;

    public constructor() {
        // TODO: read from environment variables
        this.client_id = "tJ0b7FZqRmA8bYMLhRC4uMwHIE3lfV0f";
        this.client_secret = "kA19mwk08Y0Gso-l2mscK6MpruMuGfXhocBDoOuqzltOnpLYVwp2Yl5GFn1DKuAK";
        this.audience = "https://dev-emppp88ojksbdj0d.us.auth0.com/";
        this.token = "";
    }

    public async setToken() {
        const token = await axios.post(this.audience + "oauth/token", {
            client_id: this.client_id,
            client_secret: this.client_secret,
            audience: this.audience + "api/v2/",
            grant_type: "client_credentials"
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        this.token = token.data.access_token;
    }

    public async createUser(email: string) {
        await axios.post(this.audience + "api/v2/users", {
            email: email,
            email_verified: false,
            password: Math.random().toString(36).slice(-20),
            connection: "Username-Password-Authentication"
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }
        });
    }

    private async getUserID(email: string) {
        const user_id = await axios.get(this.audience + "api/v2/users-by-email", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            },
            params: {
                email: email
            }
        });
        return user_id.data[0].user_id;
    }

    public async inviteUser(email: string) {
        await axios.post(this.audience + "dbconnections/change_password", {
            client_id: this.client_id,
            email: email,
            connection: "Username-Password-Authentication"
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }
        });
    }

    public async deleteUser(email: string) {
        this.getUserID(email).then(async (user_id) => {
            await axios.delete(this.audience + "api/v2/users/" + user_id, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.token
                }
            });
        });
    }
}

export default Auth0Utility;
