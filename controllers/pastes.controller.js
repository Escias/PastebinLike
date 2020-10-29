module.exports = function createUserController(db) {

    const pastes = db.collection('pastes')

    return {
        async createcontent({ title, content, userid}) {
            await pastes.insertOne({
                title: title, content: content, userid: userid
            })
            return { success: true }
        },

        // retourne un array contenant les information du paste
        async getpaste({title}){
            const paste = await pastes.findOne({title: title})
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

        //retourne l'id de l'utilisateur à l'origine du paste
        async getuser({title}){
            const user = await pastes.findOne({title: title}, {userid:true})
            return {success:true, user}
        }
    }
}
