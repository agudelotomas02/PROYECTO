const express = require('express');
const app = express();

const inventoryRoutes = require('./routes/inventoryRoutes');

app.use(express.json());
app.use('/api', inventoryRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`It's alive on http://localhost:${PORT}`);
});