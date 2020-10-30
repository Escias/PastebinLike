const slug = require('slug')
module.exports = function createUserController(db) {

    const pastes = db.collection('pastes')

    return {
        async createcontent({ title, content, username}) {
            var url = slug(title);
            var date = new Date(Math.round(new Date().getTime() / 1000))
            await pastes.insertOne({
                title: title, content: content, username: username, url:url,date:date
            })
            return { success: true }
        },

        // retourne un array contenant les information du paste
        async getpaste(url){
            const paste = await pastes.findOne({url: url})
            console.log('paste')
            console.log(paste)
            return {success:true, paste}
        },

        // retourne le titre du paste
        async gettitle({title}){
            const tit = await pastes.findOne({title: title}, {title:true})
            return {success:true, tit}
        },

        //retourne le contenu du paste
        async getcontent({title}){
            const cont = await pastes.findOne({title: title}, {content:true})
            return {success:true, cont}
        },

        //retourne l'username de l'utilisateur à l'origine du paste
        async getuserfrompaste({title}){
            const user = await pastes.findOne({title: title}, {username:true})
            return {success:true, user}
        }
    }
}
