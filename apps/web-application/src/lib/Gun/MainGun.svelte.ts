// 🔫
import Gun from "gun";
import "gun/sea";
import 'gun/nts';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';

import { BACKEND_URL } from "./Constants";
import { fetchUserSeed, identify } from "./Utils";

export const gun = Gun({
    peers: [BACKEND_URL + "/gun"],
    localStorage: false
});

export let logged = $state<{
    isLogged: boolean
}>({
    isLogged: false
})

export const user = gun.user().recall({ sessionStorage: false }) as ReturnType<typeof gun.user>;

gun.on("auth", async () => {
    const userId = await identify().catch(() => undefined);
    console.log(`[GUN AUTH]: Logged In as ${userId?.id || "UNKNOWN"}`);
    
    logged.isLogged = true;
})

export function hasUser(userId: string) {
    return new Promise<boolean>((res) => {
        gun.get(`~@${userId}`).once((data) => {
            res(!!data);
        })
    })
}

export async function login(userId: string, seed?: string) {
    if (!seed) {
        const userSeed = await fetchUserSeed().catch(e => console.log(e));
        if (!userSeed) throw new Error("Login with discord first");

        seed = userSeed.seed;
    }

    return new Promise<void>((resolve, reject) => {
        user.auth(userId, seed, (ack) => {
            if ((ack as { err?: string }).err) {
                reject((ack as { err: string }).err);
            }

            resolve();
        })
    })
}

export async function signUp() {
    const userSeed = await fetchUserSeed().catch(e => console.log(e));

    if (!userSeed) throw new Error("Login with discord first");

    const { userId, seed } = userSeed;

    return new Promise((resolve, reject) => {
        user.create(userId, seed, (ack) => {
            if ((ack as any).err) reject((ack as any).err);

            login(userId, seed)
                .then(resolve)
                .catch(reject);
        });
    })
}