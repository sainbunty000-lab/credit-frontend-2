import { openDB } from "idb";

const dbPromise = openDB("creditdb",1,{
upgrade(db){
db.createObjectStore("cases",{keyPath:"id"});
}
});

export async function saveCase(data){
const db = await dbPromise;
return db.put("cases",data);
}

export async function getCases(){
const db = await dbPromise;
return db.getAll("cases");
}
