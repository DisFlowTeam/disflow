if(!localStorage.getItem("user")) {
    localStorage.setItem("user", JSON.stringify({
        name: "admin",
        avatar: "https://lastfm.freetls.fastly.net/i/u/avatar170s/635ee48d09535311aa943c497e6656e7",
        uid: "admin0",
        projects: [],
        previewProjects: []
    }));
}

export * from "./Project/Project";
export * from "./User/User";
export * from "./DataManager";