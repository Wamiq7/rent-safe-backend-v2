// routes.js
const AuthRoute = require('../v2/AuthRoute.js');
const PropertyRoute = require('../v2/PropertyRoute.js');
const AgreementRoute = require('../v2/AgreementRoute.js');


module.exports = function (app) {
    app.use("/user", AuthRoute);
    app.use('/property', PropertyRoute)
    app.use('/agreements', AgreementRoute)
    app.use("/check", (req, res) => {
        res.json("Running");
    })
};
