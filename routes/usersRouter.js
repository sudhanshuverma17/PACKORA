const express = require('express');
const router = express.Router();
const {registerUser,loginUser} = require('../controllers/authController');
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const userModel = require('../models/user-model');
const transporter = require("../config/node-mailer");


router.post('/register', registerUser );

router.post('/login', loginUser );

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        return res.redirect('/?logout=1');
    });
});

router.get("/forgot-password", (req, res) => {

    let error = req.flash("error");
    let success = req.flash("success");

   return res.status(200).render("forgotPassword", {
        error,
        success
    });
});
 

router.post("/forgot-password", async (req, res) => {
 try {
   const email = req.body.email.trim().toLowerCase();
   const user = await userModel.findOne({ email });

   if (!user) {
     req.flash("error", "Email not found");
     return res.redirect("/users/forgot-password");
   }

   const token = crypto.randomBytes(32).toString("hex");

   user.resetToken = token;
   user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

   await user.save();

   const resetLink = `${process.env.BASE_URL}/users/reset-password/${token}`;

   await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your PACKORA Password",
      html: `...`
   });

   req.flash("success", "Reset link generated (check your email)");

   req.session.save(() => {
      return res.redirect("/");
   });

 } catch(err){
   console.log(err);
   req.flash("error", "Something went wrong");
   return res.redirect("/users/forgot-password");
 }
});

router.get("/reset-password/:token", async (req, res) => {

  const user = await userModel.findOne({
    resetToken: req.params.token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) return res.send("Invalid or expired token");

  return res.status(200).render("resetPassword", { token: req.params.token });
});

router.post("/reset-password/:token", async (req, res) => {

  const user = await userModel.findOne({
    resetToken: req.params.token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) return res.send("Invalid or expired token");

  if(req.body.password.length < 6){
   req.flash("error", "Password must be at least 6 characters");
   return res.redirect("back");
}

  const hashed = await bcrypt.hash(req.body.password, 10);

  user.password = hashed;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  req.flash("success", "Password reset successful");
  return res.status(302).redirect("/");
});


module.exports = router;