import { BACKEND_URL } from "../Constants";

export interface UserData {
    avatar?: string,
    username: string,
    id: string
}

let userData: UserData|undefined;

export async function makeRequestJson(url: string) {
    const response = await fetch(url, {
        credentials: "include"
    });

    if (!response.ok) return undefined;

    return response.json();
}

export async function fetchUserSeed() {
    return makeRequestJson(BACKEND_URL + "/crypto/seed") as Promise<undefined | { userId: string, seed: string }>;
}

export async function identify(force = false) {
    if(userData && !force) return userData
    const data = await makeRequestJson(BACKEND_URL + "/auth/me") as undefined | UserData;

    if(data) userData = data;

    return data;
}