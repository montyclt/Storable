/**
 * Storable 16.8.10 (10/08/2016) written by Ivan Montilla
 * www.ivanmontilla.es <personal@ivanmontilla.es>
 *
 * This library is free software, you're allowed to study, adapt and redistribute.
 *
 * Ivan Montilla (c) 2016
 *
 * Storable is a library for using LocalStorage and SessionStorage in TypeScript Lang.
 *
 * This library is a parent class that implements methods to store and retrieve Objects
 * to|from LocalStorage and SessionStorage.
 *
 * The usage of this library is very simple, you only need to extend this, and call the methods
 * objet.store(key, storage) and Class.retrieve(key, storage).
 *
 * The most important feature in this library is that the retrieve method sets the class into the prototype
 * of the obtained objects.
 *
 * The storages that the library can use are:
 *
 * Storable.LOCAL_STORAGE -> stores data with no expiration date.
 * Storable.SESSION_STORAGE -> stores data for one session (data is lost when the browser tab is closed).
 *
 * 
 * Example to save a new client:
 * <pre>
 *     let newClient: Person = new Person("Peter");
 *     newClient.store("last_client", Storable.LOCAL_STORAGE);
 * </pre>
 * 
 * Example to retrieve the boss:
 * <pre>
 *     let boss: Person = Person.retrieve("boss", Storable.LOCAL_STORAGE);
 * </pre>
 *
 *
 * To use this library with Arrays and Objects, you need to wrap these into a StorableArray or a StorableObject.
 *
 * Example doing this:
 *
 * <pre>
 *     let clients: StorableArray = new StorableArray([
 *         new Person("Peter"),
 *         new Person("Jane"),
 *         new Person("John")
 *     ]);
 *
 *     clients.store("clients", Storable.LOCAL_STORAGE);
 * </pre>
 *
 * For obtaining the original Array or Object, you'll need to access the <i>value</i> field, for example:
 *
 * <pre>
 *     let clientsRetrieveds: Array<Person> = StorableArray.retrieve("clients").value;
 * </pre>
 *
 * And you can set the <i>value</i> field to change the Array or Object contained in this wrapper.
 */
export class Storable {
    static LOCAL_STORAGE   :number = 1;
    static SESSION_STORAGE :number = 2;

    /**
     * Store object in LocalStorage or SessionStorage.
     * 
     * @param key string
     * @param storage number
     */
    store(key: string, storage: number): void {
        if (storage != Storable.LOCAL_STORAGE && storage != Storable.SESSION_STORAGE)
            throw new RangeError("Storage must be 1 (LOCAL_STORAGE) or 2 (SESSION_STORAGE)");
        else {
            let strObject: string = JSON.stringify(this);
            if (storage == Storable.LOCAL_STORAGE) {
                window.localStorage.setItem(key, strObject);
            } else {
                window.sessionStorage.setItem(key, strObject);
            }
        }
    }

    /**
     * Retrieves an object from LocalStorage or SessionStorage and returns it.
     * 
     * @param key string
     * @param storage number
     * @return any
     */
    static retrieve(key: string, storage: number): any {
        if (storage != Storable.LOCAL_STORAGE && storage != Storable.SESSION_STORAGE)
            throw new RangeError("Storage must be 1 (LOCAL_STORAGE) or 2 (SESSION_STORAGE)");
        else {
            if (storage == Storable.LOCAL_STORAGE) {
                let strObject: string = window.localStorage.getItem(key);
                try {
                    let obj = JSON.parse(strObject);
                    let nObj: PropertyDescriptorMap = {};
                    for (let v in obj) {
                        if (obj.hasOwnProperty(v))
                            nObj[v] = {value: obj[v], writable: true, enumerable: true};
                    }
                    return Object.create(new this, nObj);
                } catch(e) {
                    throw e;
                }
            } else {
                let strObject: string = window.sessionStorage.getItem(key);
                try {
                    let obj = JSON.parse(strObject);
                    let nObj: PropertyDescriptorMap = {};
                    for (let v in obj) {
                        if (obj.hasOwnProperty(v))
                            nObj[v] = {value: obj[v], writable: true, enumerable: true};
                    }
                    return Object.create(new this, nObj);
                } catch(e) {
                    throw e;
                }
            }
        }
    }
}

/**
 * This class is a wrapper to store Arrays using the parents methods.
 */
export class StorableArray extends Storable {
    public value: Array<any>;

    /**
     * Construct the Array Wrapper using an Array as the parameter.
     *
     * @param value
     */
    constructor(value: Array<any>) {
        super();
        this.value = value;
    }
}

/**
 * This class is a wrapper to store Objects using the parents methods.
 */
export class StorableObject extends Storable {
    public value: Object;

    /**
     * Construct the Array Wrapper using an Object as the parameter.
     * @param value
     */
    constructor(value: Object) {
        super();
        this.value = value;
    }
}
