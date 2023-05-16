import { createContext, useContext } from 'react';
import { observable, action } from 'mobx';

export class LocalStorageManager {
    prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    setItem(key: string, value: any) {
        localStorage.setItem(`${this.prefix}-${key}`, JSON.stringify(value));
    }

    getItem(key: string) {
        const value = localStorage.getItem(`${this.prefix}-${key}`);
        return value ? JSON.parse(value) : null;
    }
}

export class LocalStore {
    storageManager: LocalStorageManager;
    @observable myData: any = [];

    constructor(storageManager: LocalStorageManager) {
        this.storageManager = storageManager;

        const storedData = this.storageManager.getItem('myData');
        if (storedData) {
            this.myData = storedData;
        } else {
            this.storageManager.setItem('myData', []);
        }
    }
    @action updateObject(index: number, newData: any) {
        this.myData[index] = newData;
        this.storageManager.setItem('myData', this.myData);
    }

    @action setMyData(data: any) {
        this.myData = data;
        this.storageManager.setItem('myData', data);
    }

    @action addObject(data: any) {
        this.myData.push(data);
        this.storageManager.setItem('myData', this.myData);
    }

    @action deleteObject(index: number) {
        this.myData.splice(index, 1);
        this.storageManager.setItem('myData', this.myData);
    }
}

const storageManager = new LocalStorageManager('DateLocale');
const StoreContext = createContext(new LocalStore(storageManager));
export const useStore = () => useContext(StoreContext);