const express=require("express");
const { User } = require("../Models/user.model");
const userRouter=express.Router();






userRouter.get("/",async(req,res)=>{

    const {userId}=req.params;

    try {
        const user=await User.findById(userId);
        if(user){
            return res.status(200).json({user:user})
        }
    } catch (error) {
        res.status(404).json({message:"user not found"})
    }
    
})


// Update Profile Endpoint
userRouter.put('/', async (req, res) => {
    const { userId } = req.params;
    
    const { fullName, avatar, currentPassword, newPassword } = req.body;
    try {
      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update full name if provided
      if (fullName) {
        user.fullName = fullName;
      }
  
      // Update avatar if provided
      if (avatar) {
        user.avatar = avatar;
      }
  
      // Change password if currentPassword and newPassword provided
      if (currentPassword && newPassword) {
        // Verify current password
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
          return res.status(401).json({ message: 'Invalid current password' });
        }
        
        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
      }
  
      await user.save();
  
      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  