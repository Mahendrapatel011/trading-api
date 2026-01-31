
import connectDatabase from '../config/database.config.js';
import { initAssociations } from '../models/index.js';

const sync = async () => {
    try {
        console.log('Initializing associations...');
        initAssociations();
        console.log('Connecting to database and syncing...');
        await connectDatabase();
        console.log('Sync complete.');
        process.exit(0);
    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
};

sync();
