const User = require("../models/user_model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionInfo = require("../util/session-flash");
function getSignup(req, res) {
  let sessionData=sessionInfo.getSessionData(req);
  if(!sessionData){
    sessionData={
      email:'',
      confirmEmail:'',
      password:'',
      name:'',
      street:'',
      postal:'',
      city:''
    }
  }
  res.render("customer/auth/signup",{inputData:sessionData});
}
async function signup(req, res,next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail:req.body['confirm-email'],
    password: req.body.password,
    name: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };
  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    sessionInfo.flashDataToSession(
      req,
      {
        errorMessage: "Please check your input.",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );
  try {
    const existAlready = await user.existsAlready();
    if (existAlready) {
      sessionInfo.flashDataToSession(
        req,
        {
          errorMessage: "The username Already exists!!!",
          ...enteredData
        },
        function () {
          res.redirect("/signup",);
        }
      );
      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }
  res.redirect("/login");
}
function getLogin(req, res) {
  let sessionData=sessionInfo.getSessionData(req);
  if(!sessionData){
    sessionData={
      email:'',
      password:''
    }
  }
  res.render("customer/auth/login",{inputData:sessionData});
}
async function login(req, res) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }
  if (!existingUser) {
    sessionInfo.flashDataToSession(req,{
      errorMessage:"The credentials entered is wrong check Password and/or Email",
      email:user.email,
      password:user.password
    },function(){
      res.redirect("/login");
    })
    return;
  }
  const passwordMatch = await user.hasMatchingPassword(existingUser.password);
  if (!passwordMatch) {
    sessionInfo.flashDataToSession(req,{
      errorMessage:"The credentials entered is wrong check Password and/or Email",
      email:user.email,
      password:user.password
    },function(){
      res.redirect("/login");
    })
    return;
  }
  authUtil.createUserSession(req, existingUser, function () {
    console.log(res.locals.uid)
    res.redirect("/");
  });
}
function logout(req, res) {
  req.session.destroy(() => {
  res.redirect('/login');
});
}
module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
