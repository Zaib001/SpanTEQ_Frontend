

export const StorageService = {
    
    setItem(key: string, value: any, persistent: boolean = false): void {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

            if (persistent) {
                localStorage.setItem(key, stringValue);

                sessionStorage.removeItem(key);
            } else {
                sessionStorage.setItem(key, stringValue);

                localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error storing ${key}:`, error);
        }
    },

    getItem(key: string, parseJSON: boolean = false): any {
        try {

            let value = localStorage.getItem(key);

            if (value === null) {
                value = sessionStorage.getItem(key);
            }

            if (value === null) {
                return null;
            }

            if (parseJSON) {
                try {
                    return JSON.parse(value);
                } catch {
                    return value;
                }
            }

            return value;
        } catch (error) {
            console.error(`Error retrieving ${key}:`, error);
            return null;
        }
    },

    removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
        }
    },

    clearAuth(): void {
        this.removeItem('authToken');
        this.removeItem('authUser');
    },

    isAuthenticated(): boolean {
        return this.getItem('authToken') !== null;
    },
};

export default StorageService;
