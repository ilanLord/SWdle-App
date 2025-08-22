// src/utils/ensureDatabase.ts
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

export const DB_NAME = "database.db";

const getDbDir = () => `${FileSystem.documentDirectory}SQLite`;
const getDbPath = () => `${getDbDir()}/${DB_NAME}`;

/**
 * Copie l'asset database.db vers <DocumentDirectory>/SQLite/database.db
 * - Si overwrite=true : supprime et recopie.
 * - Sinon : compare la taille du fichier bundlé et du fichier cible ; si différente, recopie.
 */
export async function ensureDatabaseCopied({ overwrite = false } = {}): Promise<string> {
  const dst = getDbPath();

  // assure le dossier existe
  await FileSystem.makeDirectoryAsync(getDbDir(), { intermediates: true }).catch(() => {});

  // load asset
  const asset = Asset.fromModule(require("@/assets/database.db"));
  await asset.downloadAsync(); // rempli asset.localUri si besoin
  const src = asset.localUri ?? asset.uri;
  if (!src) throw new Error("Impossible de trouver l'URI locale de l'asset database.db");

  // info src
  const srcInfo = await FileSystem.getInfoAsync(src, { size: true });
  // info dst
  const dstInfo = await FileSystem.getInfoAsync(dst, { size: true });

  // Si dst existe et qu'on ne veut pas overwrite : compare les tailles
  if (dstInfo.exists && !overwrite) {
    const dstSize = dstInfo.size ?? -1;
    const srcSize = srcInfo.size ?? -1;
    // console.log(`[ensureDatabase] dst exists (${dst}): size=${dstSize}, src size=${srcSize}`);
    if (dstSize === srcSize && dstSize > 0) {
    //   console.log("[ensureDatabase] DB already present and sizes match, skip copy.");
      return dst;
    } else {
    //   console.log("[ensureDatabase] DB present but size differs -> will overwrite.");
    }
  }

  // Si on doit écraser et que dst existe, delete d'abord (idempotent)
  if (dstInfo.exists && (overwrite || dstInfo.size !== srcInfo.size)) {
    try {
      await FileSystem.deleteAsync(dst, { idempotent: true });
    } catch (e) {
    //   console.warn("[ensureDatabase] Erreur suppression ancienne DB :", e);
    }
  }

  // Copy
  await FileSystem.copyAsync({ from: src, to: dst });
//   console.log("[ensureDatabase] Copied DB asset to", dst, " (src:", src, "size:", srcInfo.size, ")");
  return dst;
}
