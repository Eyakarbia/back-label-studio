let controller = {};
let userModel = require('./model');

controller.get = async (req, res) => {
    try {
        let userData = await userModel.find();
        res.send(userData);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).send('Internal server error');
    }
};

controller.create = async (req, res) => {
    try {
        await userModel.create({ name: "eya", age: 25 });
        res.send("User has been created successfully");
    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(500).send('Internal server error');
    }
};

module.exports = controller;
