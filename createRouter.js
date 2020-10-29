
const Router = require('express').Router
const createUserController = require('./controllers/users.controller')
const createPastebinController = require('./controllers/pastes.controller')


async function createRouter(db) {
    const router = Router()
    const UserController = createUserController(db)
    const PastebinController = createPastebinController(db)

    async function isAuth(req, res, next) {
        console.log('isAuth is called now')
        if (req.headers['authorization']) {
            const token = req.headers['authorization']
            console.log('token is', token)
            const result = await db.collection('users').findOne({ authToken: token })
            if (result) {
                req.isAuth = true
                req.authUser = result
            }
        }

        next();
    }

    /* Ceci est le block de code a dupliquer pour continuer l'app */
    router.get('/', (req, res) => {
        res.render('home.twig', {
        });
        //return res.json({ hello: 'White' })
    })

    router.post('/signup', async function(req, res) {
        const signupResult = await UserController.signup(req.body)
        return res.json(signupResult)
    })

    router.post('/login', async function(req, res){
        const loginResult = await UserController.login(req.body)
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
    router.post('/create',async function(req,res){
        const pastebin = await PastebinController.createcontent(req.body)
        return res.json(pastebin)
    })

    router.get('/my-pastes', isAuth, async function (req, res) {
        if (!req.isAuth) {
            return res.status(401).end();
        }
        const mypastes = await db.collection('pastes').find({ 'owner.id': req.authUser._id }, 'title slug createdAt').toArray()

        return res.json({
            list: mypastes,
            isAuth: req.isAuth,
        })
    })

    router.get('/past/:slug', async function (req, res){
        const pastebin = await PastebinController.getpaste(req.params.slug);
        console.log(pastebin.cont);
        res.render('pastebin.twig', {
            pastebin: pastebin.paste
        });
    });

    router.get('/create', (req, res) => {
        res.render('create.twig', {
        });
    });

    return router
}

module.exports = createRouter
