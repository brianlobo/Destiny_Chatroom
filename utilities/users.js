const users = [];

const userJoin = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);
    return user;
}

const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getRoomUsers = room => {
    return users.filter(user => user.room === room)
};

const getCurrentUser = id => {
    console.log(id)
    console.log(users)
    return users.find(user => user.id === id);
}

module.exports = {
    userJoin,
    userLeave,
    getRoomUsers,
    getCurrentUser
}