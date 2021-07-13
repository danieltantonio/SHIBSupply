(() => {
    const isAuth = (req,res,next) => {
        if(req.isAuthenticated() && req.user.verified) {
            next();
        } else {
            res.status(401).json({ msg: 'Access denied' });
        }
    };
    
    module.exports = {
        isAuth
    };
})();