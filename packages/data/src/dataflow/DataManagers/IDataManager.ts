export interface CacheOptions<T> {
    initialData?: ConstructorParameters<typeof Map<string, T>>[0];
    deleteInterval?: number;
    checkInterval?: number;
}

interface RawCacheData<T> {
    lastAccessed: number;
    data: T;
}

export abstract class IDataManager<T> {
    private deleteInt: number;
    private interval: number;
    private data: Map<string, RawCacheData<T>>;

    constructor(opts: CacheOptions<T>) {
        this.deleteInt = opts.deleteInterval || 1.8e+6;
        this.data = new Map<string, RawCacheData<T>>();
        this.interval = setInterval(() => this.refresh(), opts.checkInterval || 600000);
    }

    abstract fetch(id: string): Promise<T>;
    
    has(id: string) {
        return this.data.has(id);
    }

    get(id: string) {
        const d = this.data.get(id);
        if(!d) return undefined;
        d.lastAccessed = Date.now();
        this.data.set(id, d);
        return d.data;
    }

    set(id: string, data: T) {
        const d: RawCacheData<T> = { lastAccessed: Date.now(), data };
        this.data.set(id, d);
    }

    delete(id: string) {
        return this.data.delete(id);
    }

    destroy() {
        clearInterval(this.interval);
    }

    refresh() {
        const keys = this.data.keys();

        for(const key of keys) {
            const data = this.data.get(key)!;
            if(data.lastAccessed + this.deleteInt > Date.now()) continue;
            this.data.delete(key);
        }
    }
}