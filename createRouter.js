
const Router = require('express').Router
const createUserController = require('./controllers/users.controller')
const createPastebinController = require('./controllers/pastes.controller')


async function createRouter(db) {
    const router = Router()
    const UserController = createUserController(db)
    const PastebinController = createPastebinController(db)

    async function isAuth(req, res, next) {
        console.log('isAuth is called now')
        console.log(req.cookies.authToken)
        if (req.cookies.authToken) {
            const token = req.cookies.authToken
            console.log('token is', token)
            const result = await db.collection('users').findOne({ authToken: token })
            if (result) {
                req.isAuth = true
                req.authUser = result
                req.username = result.pseudo
            }
        }

        next();
    }

    router.get('/logout',(req,res)=>{
        res.cookie('authToken','3333', { maxAge: 1, httpOnly: true })
        res.redirect('/')
    })
    /* Ceci est le block de code a dupliquer pour continuer l'app */
    router.get('/',await isAuth, (req, res) => {
        res.render('home.twig', {
            name:req.username,
        });
        //return res.json({ hello: 'White' })
    })

    router.post('/signup', async function(req, res) {
        const signupResult = await UserController.signup(req.body)
        return res.json(signupResult)
    })

    router.post('/login', async function(req, res){
        const loginResult = await UserController.login(req.body)
        res.cookie('authToken',loginResult.authToken, { maxAge: 900000, httpOnly: true });
        return res.json(loginResult)
    });

    router.get('/login',(req,res)=>{
        res.render('login.twig', {
        });
    })
    router.get('/signup',(req,res)=>{
        res.render('register.twig', {
        });
    })
    router.post('/create',await isAuth,async function(req,res){
        const pastebin = await PastebinController.createcontent(req.body)
        return res.json(pastebin)
    })

    router.get('/my-pastes', await isAuth, async function (req, res) {
        if (!req.isAuth) {
            return res.status(401).end();
        }
        const mypastes = await db.collection('pastes').find({ 'username': req.username }).toArray()

        res.render('myPastebin.twig',{
            pastebins: mypastes,
            name:req.username
        });
    })

    router.get('/past/:slug', await isAuth,async function (req, res){
        const pastebin = await PastebinController.getpaste(req.params.slug);
        console.log(pastebin.cont);
        res.render('pastebin.twig', {
            pastebin: pastebin.paste,
            name:req.username
        });
    });

    router.get('/create',await isAuth, (req, res) => {
        res.render('create.twig', {
            name:req.username
        });
    });

    return router
}

module.exports = createRouter
