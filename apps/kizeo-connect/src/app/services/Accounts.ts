import { Adapter, InjectAdapter } from "@tsed/adapters";
import { PlatformContext } from "@tsed/common";
import { Injectable } from "@tsed/di";
import { deserialize } from "@tsed/json-mapper";
import { AccessToken, AuthorizationCode, DeviceCode } from "@tsed/oidc-provider";
import { Account } from "../models/Account";

@Injectable()
export class Accounts {
  @InjectAdapter("Accounts", Account)
  adapter: Adapter<Account>;

  async $onInit() {
    const accounts = await this.adapter.findAll();

    // We create a default account if the database is empty
    if (!accounts.length) {
      await this.adapter.create(deserialize({
        email: "test@test.com",
        emailVerified: true
      }, { useAlias: false }));
    }
  }

  async findAccount(id: string, token: AuthorizationCode | AccessToken | DeviceCode | undefined, ctx: PlatformContext) {
    return this.adapter.findById(id);
  }

  async authenticate(email: string, password: string) {
    return this.adapter.findOne({ email });
  }
}