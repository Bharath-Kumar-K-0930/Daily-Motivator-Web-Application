
import { MongoClient } from 'mongodb';

async function listDbs() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const adminDb = client.db('admin');
        const result = await adminDb.admin().listDatabases();

        console.log("Databases:");
        result.databases.forEach(db => {
            console.log(`- '${db.name}'`);
        });

    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

listDbs();
