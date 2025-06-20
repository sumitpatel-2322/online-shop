function createUserSession(req, user, action) {
  req.session.uid = user._id.toString();
  req.session.isAdmin=user.isAdmin;
  req.session.save(action);
}
function destroyUserAuthentication(req) {
  req.session.uid = null;
}
module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthentication: destroyUserAuthentication,
};
