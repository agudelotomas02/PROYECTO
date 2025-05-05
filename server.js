const express = require('express');
const app = express();

const { router: inventoryRoutes } = require('./routes/inventoryRoutes');


app.use(express.json());
app.use('/api', inventoryRoutes);

const cartsRoutes = require('./routes/cartsRoutes');
app.use('/api', cartsRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`It's alive on http://localhost:${PORT}`);
});