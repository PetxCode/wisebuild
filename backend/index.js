const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;

// Environment variable for MongoDB connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/shared_db';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URL)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Schema and Model
const DataSchema = new mongoose.Schema({
    message: String,
    stats: {
        activeUsers: Number,
        requestsProcessed: Number,
        serverStatus: String
    },
    features: [{ id: Number, name: String, status: String }],
    lastModified: { type: Date, default: Date.now }
});

const DataRecord = mongoose.model('DataRecord', DataSchema);

// Mock data initializer (Seeds the DB if empty)
async function seedDatabase() {
    const count = await DataRecord.countDocuments();
    if (count === 0) {
        console.log('Seeding initial data to MongoDB...');
        await DataRecord.create({
            message: "Hello from the Persistent Central Backend!",
            stats: {
                activeUsers: 124,
                requestsProcessed: 5678,
                serverStatus: "Optimal"
            },
            features: [
                { id: 1, name: "MongoDB Persistence", status: "Active" },
                { id: 2, name: "Real-time Synchronization", status: "Enabled" },
                { id: 3, name: "Cross-platform Communication", status: "Active" }
            ]
        });
    }
}

seedDatabase();

app.get("/", (req, res) => {
    return res.json({message: "hello from the backend"  })
})

app.get('/api/data', async (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] Data requested from frontend`);
    try {
        const record = await DataRecord.findOne().sort({ lastModified: -1 });
        if (record) {
            res.json({
                ...record.toObject(),
                timestamp: new Date().toISOString() // Dynamic timestamp for frontend freshness
            });
        } else {
            res.status(404).json({ error: "No data found in database" });
        }
    } catch (err) {
        res.status(500).json({ error: "Database retrieval error", details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`hmm thinking about watch - awesome, Backend server running on http://localhost:${PORT}`);
});
