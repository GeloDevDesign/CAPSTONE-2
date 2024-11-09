import crypto from 'crypto';
import bcrypt from 'bcrypt';
import sendOTPEmail from '../Utils/mailer.js';
import userAuthModel from '../model/userAuthModel.js';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const forgotPassword = async (req, res) => {
  const { email, username } = req.body;
  
  if (!email || !username) {
    return res.status(400).json({ message: 'Email and username are required' });
  }

  try {
    const user = await userAuthModel.findUsernameAndEmail(username, email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    await userAuthModel.saveOTP(email, otp, otpExpires);
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error in sending OTP' });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await userAuthModel.findUserByOTP(email, otp);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Generate a short-lived token for the actual password reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    await userAuthModel.saveResetToken(email, resetToken, resetTokenExpires);

    res.status(200).json({ message: 'OTP verified successfully', resetToken });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({ message: 'Reset token and new password are required' });
  }

  try {
    const user = await userAuthModel.findUserByResetToken(resetToken);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userAuthModel.updatePassword(user.id, hashedPassword);
    await userAuthModel.clearResetToken(user.id);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  forgotPassword,
  verifyOTP,
  resetPassword
};