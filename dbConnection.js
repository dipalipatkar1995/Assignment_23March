
  
  

let users = [
    {id: 1, author: "Darshan", title: "Destiny", ISBN: "ABCD",release_date:"2020-10-01"},
    {id: 2, author: "Shubham", title: "Bajirao", ISBN: "EFGH",release_date:"2020-11-01"},
    {id: 3, author: "Aslam", title: "freedom", ISBN: "IJKL",release_date:"2020-12-01"},
    {id: 4, author: "Vijay", title: "Vijaywada", ISBN: "MNLO",release_date:"2020-09-01"}
]

function getUsers() {
    return users;
}

function saveUser(user) {
    const numberOfUsers = users.length
    user['id'] = numberOfUsers + 1
    users.push(user);
}

function deleteUser(id) {
    const numberOfUsers = users.length
    users = users.filter(user => user.id != id);
    return users.length !== numberOfUsers
}

function replaceUser(id, user) {
    const foundUser = users.filter(usr => usr.id == id);
    if (foundUser.length === 0) return false
    users = users.map(usr => {
        if (id == usr.id) {
            usr = {id: usr.id, ...user};
        }
        return usr
    })
    return true
}

const Users = function() {}

Users.prototype.getUsers = getUsers
Users.prototype.saveUser = saveUser
Users.prototype.deleteUser = deleteUser
Users.prototype.replaceUser = replaceUser


module.exports = new Users()