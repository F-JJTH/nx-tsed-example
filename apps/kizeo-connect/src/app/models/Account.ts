import { Email, Name, Property } from "@tsed/schema";

export class Account {
  @Name("id")
  _id: string;

  @Email()
  email: string;

  @Property()
  @Name("email_verified")
  emailVerified: boolean;

  @Property()
  @Name("first_name")
  firstname: string;

  // Added in v7
  [key: string]: unknown;

  get accountId() {
    return this._id;
  }

  async claims() {
    return {
      sub: this._id,
      email: this.email,
      firstname: this.firstname,
      email_verified: this.emailVerified
    };
  }
}