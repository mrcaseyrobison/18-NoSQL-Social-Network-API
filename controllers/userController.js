const { User, Thought } = require ('../models');

module.exports = {
    // Get Users
    getUsers(req, res) {
        User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err));
    },
    // Get One User
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .setlect('__v')
        .then((user) => 
        !user
        ? res.status(404).json({ message: "No user with that ID" })
        : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Create a New User
    createUser(req, res) {
        User.create(req.body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(500).json(err));
    },  
    // Update User
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { new: true}
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: "No user with this ID" });
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(500).json(err));
    },
    // Delete User
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: "No user with this ID" });
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(500).json(err));
    },
    // Add a Friend
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: "No user with this ID" });
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(500).json(err));
    },
    // Remove a Friend
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: "No user with this id" });
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(500).json(err));
    },
};