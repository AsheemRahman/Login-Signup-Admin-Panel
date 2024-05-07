const collection = require('../model/mongoDb')

const signup = (req, res) => {
    if (req.session.username) {
        res.redirect('/user/home')
    } else {
        res.render('userReg', { title: 'User Registration', status: false })
    }
}

// user register
const signupPost = async (req, res) => {
    const userInputData = {
        name: req.body.userName,
        email: req.body.userMail,
        password: req.body.userPassword
    }
    // check user with same email and exist in mongodb collection
    const existingUser = await collection.findOne({ email: userInputData.email })
    if (existingUser) {
        res.render('userRegister', { status: true, mess: "User already exists", title: "Register Error" })
    } else {
        await collection.insertMany(userInputData).then(() => {
            console.log('New User registered and data is added to collection');
            res.redirect('/')
        }).catch((err) => {
            console.log(`Error occurred while inserting data to collection ${err}`)
        })
    }
}


//login with username and password
const loginPost = async (req, res) => {
    try {
        const CheckUser = await collection.findOne({ email: req.body.userMail })
        if (CheckUser && CheckUser.password === req.body.userPassword) {
            req.session.username = req.body.userMail
            res.redirect('/user/home')
        } else {
            res.render('login', { title: "User Login", loginErrorMess: "Invalid username or password", status: true })
        }
    } catch (err) {
        console.log(`Error occurred during login ${err}`)
    }

}

// user home route
const home = async (req, res) => {
    if (req.session.username) {
        const usernameDb=await collection.findOne({email:req.session.username}) 
        res.render('userHome', { title: "User home",username:usernameDb.name })
    } else {
        res.redirect('/')
    }
}


const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(`Error occurred while destroying the session ${err}`);
        } else {
            res.redirect('/')
        }
    })
}

module.exports = { signup, signupPost, loginPost, home, logout }