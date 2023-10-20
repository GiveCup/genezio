import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";
import { Address, Account } from "@multiversx/sdk-core";
import { API_URL } from "./config";
import axios from "axios";

export type Response = {
  nonce: number;
  balance: number;
};

export class MultiversXService {
  networkProvider = new ApiNetworkProvider(API_URL);

  async queryAddress(address: string): Promise<Response> {
    console.log("Query info about address", address);

    let addressOfUser = new Address(address);
    let user = new Account(addressOfUser);
    let userOnNetwork = await this.networkProvider.getAccount(addressOfUser);
    user.update(userOnNetwork);

    return {
      nonce: user.nonce.valueOf(),
      balance: parseFloat(user.balance.toString()) / Math.pow(10, 18),
    };
  }
  async getCollectionsAddressOwns(stringAddress: string) {
    const address = new Address(stringAddress);
    try {
      let collections = await axios.get(
        `${API_URL}/accounts/${address}/roles/collections`
      );
      collections = collections.data.filter((collection: any) => {
        return collection.owner === address.bech32();
      });
      return { data: collections };
    } catch (error) {
      return { data: [] };
    }
  }

  async getLastCollectionCreated(stringAddress: string) {
    const address = new Address(stringAddress);
    try {
      let collection = await axios.get(
        `${API_URL}/accounts/${address}/roles/collections`
      );
      collection = collection.data.filter((collection: any) => {
        return collection.owner === address.bech32();
      })[0];
      return { data: collection };
    } catch (error) {
      return { data: [] };
    }
  }
}
