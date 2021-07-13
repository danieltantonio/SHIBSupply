(() => {
    const isAuth = (req,res,next) => {
        if(req.isAuthenticated()) {
            next();
        } else {
            res.status(401).json({ msg: 'Access denied' });
        }
    };
    
    module.exports = {
        isAuth
    };
})();