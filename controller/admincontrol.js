const collection = require('../model/mongoDb')


const admin = (req, res) => {
    if (req.session.admin) {
        res.redirect('/admin/home')
    } else {
        res.redirect('/admin/login')
    }
}
const login = (req, res) => {
    if (req.session.admin) {
        res.redirect('/admin/home')
    } else {
        res.render('adminLogin', { title: "Admin Login", status: false })
    }
}

// admin login
const loginPost = (req, res) => {
    const adminUsername = 'admin@gmail.com';
    const adminPassword = 'admin123'
    if (req.body.adminMail === adminUsername && req.body.adminPassword === adminPassword) {
        req.session.admin = req.body.adminMail
        res.redirect('/admin/home')
    } else {
        res.render('adminLogin', { title: 'Login Error', loginErrorMess: "Invalid username or password", status: true })
    }
}

// admin home with user search 
const home = async (req, res) => {
    if (req.session.admin) {
        try {
            // because of http get request req,query instead of req.body is used
            const userSearch = req.query.adminSearch || '';
            const user = await collection.find({ name: { $regex: userSearch, $options: 'i' } })
            res.render('adminHome', { title: 'Admin Home', user })
        } catch (err) {
            console.log(`Error occurred during admin home ${err}`);
        }
    } else {
        res.redirect('/admin')
    }
}

// edit user data
const editUser = async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await collection.findById(userID)
        const username = user.name;
        const userMail = user.email;
        console.log(user);
        if (req.session.admin) {
            res.render('adminUserUpdate', { title: "Edit user", user: user, userMail, username })
        } else {
            res.redirect('/admin/login')
        }
    } catch (err) {
        console.log(`Error occurred while editing user in admin ${err}`)
    }
}

// update user with new username and email
const updateUser = async (req, res) => {
    try {
        const { updateName, updateEmail } = req.body
        const userID = req.params.id;
        function isStringWhiteSpace(str) {
            return /^\s*$/.test(str)
        }
        const user = await collection.findById(userID)
        if (!isStringWhiteSpace(req.body.updateName)) {
            user.name = req.body.updateName
        }
        user.email = req.body.updateEmail
        user.save();
        res.redirect("/admin/home")
    } catch (err) {
        console.log(`Error occurred while editing user data ${err}`)
    }
}

const deleteUser = async (req, res) => {
    const userID = req.params.id
    await collection.findByIdAndDelete(userID)
    res.redirect('/admin/home')
}

// add new user from admin home
const addUser = (req, res) => {
    try {
        if (req.session.admin) {
            res.render('adminAddUser', { title: "Add New User", status: false })
        }
    } catch (err) {
        console.log(`Error occurred while creating new user in admin home`)
    }
}
const newUser = async (req, res) => {
    try {
        //credentials from the registration page assigned to userInputData
        const userInputData = {
            name: req.body.userName,
            email: req.body.userMail,
            password: req.body.userPassword
        }
        const existingUser = await collection.findOne({ email: userInputData.email })
        if (existingUser) {
            res.render('userRegister', { status: true, mess: "User already exists", title: "User Register Error" })
        } else {
            await collection.insertMany(userInputData).then(() => {
                console.log('New User added to collection');
                res.redirect('/admin/home')
            }).catch((err) => {
                console.log(`Error occurred while inserting data to collection ${err}`)
            })
        }
    } catch (err) {
        console.error(`Error occurred while adding new user to DB: ${err}`);
    }
};

// admin logout
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(`Error occurred while admin logout ${err}`)
        } else {
            res.redirect('/admin/login')
        }
    })
}

module.exports = { admin, login, loginPost, home, editUser, updateUser, deleteUser, addUser, newUser, logout }