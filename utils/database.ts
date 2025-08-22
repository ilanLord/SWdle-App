// src/utils/database.ts
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";

const DB_NAME = "database.db";

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Assure que la DB bundlée est importée (si besoin) puis ouvre la DB
 * en utilisant l'API asynchrone d'expo-sqlite (openDatabaseAsync).
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (db) {
        return db;
    }

    // 1) tente d'importer la DB depuis les assets (si l'API est disponible)
    //    assetId doit être un require() statique pointant vers ./assets/database.db
    try {
        // Télécharger l'asset (nécessaire pour certains environnements)
        const assetModule = require("../../assets/database.db");
        const asset = Asset.fromModule(assetModule);
        await asset.downloadAsync();

        // importDatabaseFromAssetAsync est exposé par expo-sqlite (utilisé par le provider).
        // Si la DB existe déjà, cette fonction peut rejeter — on ignore alors l'erreur.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore -- importDatabaseFromAssetAsync est présent selon la version et typings
        if (typeof (SQLite as any).importDatabaseFromAssetAsync === "function") {
            try {
                // si la DB n'existe pas encore, importe-la
                // signature: importDatabaseFromAssetAsync(databaseName, { assetId: require(...) })
                // third param directory est optionnel
                // @ts-ignore
                await (SQLite as any).importDatabaseFromAssetAsync(DB_NAME, { assetId: assetModule });
            } catch (e) {
                // si l'import échoue parce que la DB existe déjà, on continue silencieusement
                // console.warn("importDatabaseFromAssetAsync() warning:", e);
            }
        }
    } catch (err) {
        // ne pas échouer si on ne peut pas télécharger l'asset — on essayera d'ouvrir la DB
        // console.warn("Impossible de télécharger/l'importer l'asset DB :", err);
    }

    // 2) ouvre la DB via l'API asynchrone moderne
    db = await SQLite.openDatabaseAsync(DB_NAME);
    return db;
}

/**
 * Raccourci pour getAllAsync (exécute SELECT * et retourne un tableau)
 */
export async function queryAll<T = any>(sql: string, ...params: any[]): Promise<T[]> {
    const database = await getDatabase();
    // getAllAsync retourne un tableau d'objets
    // TypeScript : getAllAsync est bien présent sur SQLiteDatabase selon la version
    // @ts-ignore
    return await (database as any).getAllAsync(sql, ...params);
}
