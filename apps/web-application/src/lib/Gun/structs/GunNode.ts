import Gun from "gun";
export type GunChain = ReturnType<ReturnType<typeof Gun>['get']> | ReturnType<ReturnType<ReturnType<typeof Gun>['user']>['get']>;
export class GunNode {
    chain: GunChain;

    constructor(chain: GunChain) {
        this.chain = chain;
    }
}