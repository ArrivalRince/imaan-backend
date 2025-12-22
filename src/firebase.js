    import fs from "fs";
    import path from "path";
    import admin from "firebase-admin";
    import { fileURLToPath } from "url";

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // ⚠️ service account kamu ada di src/firebase-service-account.json (sesuai screenshot)
    const serviceAccountPath = path.join(__dirname, "firebase-service-account.json");
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

    if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    }

    export default admin;
