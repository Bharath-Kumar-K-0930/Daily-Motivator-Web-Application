
import { MongoClient } from 'mongodb';

async function inspect() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const dbName = 'Daily-Motivator-Web-DataBase';
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();

        console.log(`Contents of '${dbName}':`);
        if (collections.length === 0) {
            console.log("- (Empty)");
        } else {
            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments();
                console.log(`- ${col.name}: ${count} docs`);
            }
        }

    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

inspect();
