
import { MongoClient } from 'mongodb';

async function migrate() {
    const uri = 'mongodb://localhost:27017';
    const sourceDbName = 'Daily-Motivator-Web-DataBase 1';
    const targetDbName = 'Daily-Motivator-Web-DataBase';

    console.log(`Connecting to MongoDB at ${uri}...`);
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected successfully to server.');

        const sourceDb = client.db(sourceDbName);
        const targetDb = client.db(targetDbName);

        // Get list of collections in source database
        const collections = await sourceDb.listCollections().toArray();
        console.log(`Found ${collections.length} collections in source database.`);

        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`Migrating collection: ${collectionName}...`);

            const sourceCollection = sourceDb.collection(collectionName);
            const targetCollection = targetDb.collection(collectionName);

            const documents = await sourceCollection.find({}).toArray();

            if (documents.length > 0) {
                const operations = documents.map(doc => ({
                    replaceOne: {
                        filter: { _id: doc._id },
                        replacement: doc,
                        upsert: true
                    }
                }));

                const result = await targetCollection.bulkWrite(operations);
                console.log(`  Processed ${documents.length} documents. Inserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}, Matched: ${result.matchedCount}`);
            } else {
                console.log(`  Collection ${collectionName} is empty. Skipping.`);
            }
        }

        console.log('Migration completed successfully.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await client.close();
    }
}

migrate();
