const express = require('express');
const app = express();
const authRoutes = require('./routes/auth-route');
const connectDb = require("./utils/db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoutes);

const PORT = 5000;
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at port: ${PORT}`);
    });
});