import { IDataManager, IProject, IUser, JsonPreviewProject, JsonProject } from "../imple";
import { PreviewProject, Project } from "./Project/Project";
import { User } from "./User/User";

export class DataManager extends IDataManager {
    dataMode: "local" | "remote" = "local";

    async signIn(username: string, password: string): Promise<IUser> {
        if (username === "admin" && password === "admin") {
            const dataRaw = localStorage.getItem("user");
            let data: Record<string, unknown> = {};
            if (dataRaw) data = JSON.parse(dataRaw);
            const usr = new User({
                name: "admin",
                avatar:
                    data && typeof data.avatar === "string"
                        ? data.avatar
                        : "https://lastfm.freetls.fastly.net/i/u/avatar170s/635ee48d09535311aa943c497e6656e7",
                previewProjects:
                    data.previewProjects && Array.isArray(data.previewProjects)
                        ? data.previewProjects.map((v: JsonPreviewProject) => {
                              return new PreviewProject(v);
                          })
                        : [],
                projects: data.projects as string[],
                uid: "00000000000000000000000000",
            });

            if (!dataRaw) localStorage.setItem("user", JSON.stringify(usr));

            return usr;
        }

        throw new Error("Incorrent username or password");
    }

    async getCurrentUser(): Promise<IUser | undefined> {
        const dataRaw = localStorage.getItem("user");
        let data: Record<string, unknown> = {};
        if (dataRaw) data = JSON.parse(dataRaw);
        const usr = new User({
            name: "admin",
            avatar:
                data && typeof data.avatar === "string"
                    ? data.avatar
                    : "https://lastfm.freetls.fastly.net/i/u/avatar170s/635ee48d09535311aa943c497e6656e7",
            previewProjects:
                data.previewProjects && Array.isArray(data.previewProjects)
                    ? data.previewProjects.map((v: JsonPreviewProject) => {
                          return new PreviewProject(v);
                      })
                    : [],
            projects: data.projects as string[],
            uid: "00000000000000000000000000",
        });

        return usr;
    }

    async getProject(pId: string): Promise<IProject | undefined> {
        const projsRaw = localStorage.getItem("projects");
        if (!projsRaw) return undefined;
        const projs = JSON.parse(projsRaw) as Record<string, JsonProject>;
        if (projs[pId]) {
            return new Project(projs[pId]);
        }
    }

    // eslint-disable-next-line
    async getUser(uid: string): Promise<IUser | undefined> {
        return undefined; // cant in local mode
    }

    async signOut(): Promise<boolean> {
        localStorage.clear();
        return true;
    }
}
