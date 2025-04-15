import { exec } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source and Destination URIs
const SOURCE_URI = "mongodb+srv://achiandoomollo64:achiando%234838@mernshopping.yincy2t.mongodb.net/?retryWrites=true&w=majority&appName=Wanx";
const DESTINATION_URI = "mongodb+srv://kunduankit054:QybqanTM5cjXUUMs@event.afevq.mongodb.net/?retryWrites=true&w=majority&appName=event";

// Set a backup directory
const BACKUP_DIR = path.join(__dirname, "backup");

// Function to execute shell commands
const runCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.warn(`⚠️ Warning: ${stderr}`);
            }
            console.log(`✅ Success: ${stdout}`);
            resolve(stdout);
        });
    });
};

// Migration function
const migrateMongoDB = async () => {
    try {
        console.log("🔄 Starting MongoDB Migration...");

        // Dump Data from Source
        console.log("📤 Dumping data from source...");
        await runCommand(`mongodump --uri="${SOURCE_URI}" --out="${BACKUP_DIR}"`);

        // Restore Data to Destination
        console.log("📥 Restoring data to destination...");
        await runCommand(`mongorestore --uri="${DESTINATION_URI}" ${BACKUP_DIR}`);

        console.log("🎉 Migration completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
    }
};

// Run migration
migrateMongoDB();
