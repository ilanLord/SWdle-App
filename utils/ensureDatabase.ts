import { Platform } from "react-native";

export const DB_NAME = "database.db";
const INIT_FLAG = "swdle_db_initialized";

export async function ensureDatabaseCopied({ overwrite = false } = {}): Promise<any> {
  if (Platform.OS === "web") {
    // Si déjà initialisé et window.db existe → retourne
    if (typeof window !== "undefined" && window.localStorage?.getItem(INIT_FLAG) && !overwrite) {
      if (window.db) return window.db;
      // sinon, on continue pour recréer la DB
    }

    const initSqlJs = (await import("sql.js")).default;
    const SQL = await initSqlJs({ locateFile: () => "/sql-wasm.wasm" });

    const res = await fetch("/database.db"); // fichier dans public/
    if (!res.ok) throw new Error(`Failed to fetch database.db: ${res.status}`);
    const buffer = await res.arrayBuffer();

    const db = new SQL.Database(new Uint8Array(buffer));
    console.log("DB buffer byteLength:", buffer.byteLength);

    window.db = db;
    try { window.localStorage?.setItem(INIT_FLAG, "1"); } catch {}
    return db;
  }

  // -----------------------
  // Native (Android/iOS)
  // -----------------------
  const FileSystem = require("expo-file-system");
  const { Asset } = require("expo-asset");

  const getDbDir = () => `${FileSystem.documentDirectory}SQLite`;
  const getDbPath = () => `${getDbDir()}/${DB_NAME}`;
  const dst = getDbPath();

  await FileSystem.makeDirectoryAsync(getDbDir(), { intermediates: true }).catch(() => {});

  const asset = Asset.fromModule(require("@/assets/database.db"));
  await asset.downloadAsync();
  const src = asset.localUri ?? asset.uri;
  if (!src) throw new Error("Impossible de trouver l'URI locale de l'asset database.db");

  const srcInfo = await FileSystem.getInfoAsync(src, { size: true }).catch(() => ({}));
  const dstInfo = await FileSystem.getInfoAsync(dst, { size: true }).catch(() => ({ exists: false }));

  if (dstInfo.exists && !overwrite) {
    const dstSize = dstInfo.size ?? -1;
    const srcSize = srcInfo.size ?? -1;
    if (dstSize === srcSize && dstSize > 0) return dst;
  }

  if (dstInfo.exists && (overwrite || dstInfo.size !== srcInfo.size)) {
    await FileSystem.deleteAsync(dst, { idempotent: true }).catch(() => {});
  }

  await FileSystem.copyAsync({ from: src, to: dst });
  return dst;
}
