import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "pawbrief";
const DB_VERSION = 1;

export function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("profiles")) {
        db.createObjectStore("profiles", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("photos")) {
        db.createObjectStore("photos");
      }
    },
  });
}
