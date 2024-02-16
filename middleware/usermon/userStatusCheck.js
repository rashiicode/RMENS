

const usersFind= require("../../model/user")


const userStatusCheck = async(req,res,next)=>{
    console.log('NASIII IS THE MDLLLE WARE OF HERE')
    const email = req.session.user
    try {
        const userEmail = await usersFind.findOne({ email });

        if (userEmail && userEmail.isActive=== false) {
            req.session.user = false;
            return res.redirect('/admin/user');
        } else {
            next();
        }
    } catch (error) {
        console.error('Error during user status check:', error);
        return res.status(500).send('Internal Server Error');
    }

}

module.exports= userStatusCheck