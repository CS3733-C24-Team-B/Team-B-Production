import axios from "axios";

/**
 * The Auth0Utility class provides functions that allow an admin to create and delete users.
 * After creating an instance of the class, call setToken() to get the access token that is
 * required for the API calls in the other class functions.
 *
 * createUser() allows an admin to create a new user in Auth0.
 * inviteUser() allows an admin to send a change password email to a new user.
 * deleteUser() allows an admin to delete a user in Auth0.
 */
class Auth0Utility {
  private readonly client_id: string = "tJ0b7FZqRmA8bYMLhRC4uMwHIE3lfV0f";
  private readonly client_secret: string =
    "kA19mwk08Y0Gso-l2mscK6MpruMuGfXhocBDoOuqzltOnpLYVwp2Yl5GFn1DKuAK";
  private readonly domain: string = "https://dev-emppp88ojksbdj0d.us.auth0.com";
  private token: string;

  public constructor() {
    this.token = "";
  }

  /**
   * Gets user token and stores it in the class.
   * This needs to be called before calling other functions in the class.
   */
  public async setToken() {
    const token = await axios.post(
      this.domain + "/oauth/token",
      {
        client_id: this.client_id,
        client_secret: this.client_secret,
        audience: this.domain + "/api/v2/",
        grant_type: "client_credentials",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    this.token = token.data.access_token;
  }

  /**
   * Creates a user in Auth0 with the specified email.
   * If a user already exists with the email, there will be an error.
   * A random password is generated for the user.
   * @param email
   */
  public async createUser(email: string) {
    if (this.token === "") {
      await this.setToken();
    }
    await axios.post(
      this.domain + "/api/v2/users",
      {
        email: email,
        email_verified: true, // true means that user won't need to verify email
        password: Math.random().toString(36).slice(-20),
        connection: "Username-Password-Authentication",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        },
      },
    );
  }

  /**
   * Sends a password reset email to the user.
   * This should be called after createUser so that the user can set up their password.
   * @param email
   */
  public async inviteUser(email: string) {
    if (this.token === "") {
      await this.setToken();
    }
    await axios.post(
      this.domain + "/dbconnections/change_password",
      {
        client_id: this.client_id,
        email: email,
        connection: "Username-Password-Authentication",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        },
      },
    );
  }

  public async resetPassword(email: string): Promise<string> {
    if (this.token === "") {
      await this.setToken();
    }
    const user_id: string = await this.getUserID(email);
    const res = await axios.post(
      this.domain + "/api/v2/tickets/password-change",
      {
        user_id: user_id,
        client_id: this.client_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        },
      },
    );
    return res.data.ticket;
  }

  /**
   * Deletes a user from Auth0 with the specified email.
   * @param email
   */
  public async deleteUser(email: string): Promise<void> {
    if (this.token === "") {
      await this.setToken();
    }
    const user_id: string = await this.getUserID(email);
    await axios.delete(this.domain + "/api/v2/users/" + user_id, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      },
    });
  }

  /**
   * Gets the user_id, which is stored in Auth0 and not in our database.
   * The user_id is required for some Auth0 API calls.
   * @param email
   * @private
   */
  private async getUserID(email: string): Promise<string> {
    if (this.token === "") {
      await this.setToken();
    }
    const user_id = await axios.get(this.domain + "/api/v2/users-by-email", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      },
      params: {
        email: email,
      },
    });
    return user_id.data[0].user_id;
  }
}

export default Auth0Utility;
