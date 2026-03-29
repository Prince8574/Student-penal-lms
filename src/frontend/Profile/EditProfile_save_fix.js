// Replace the save function in EditProfile.js with this:

const save = async () => {
  if(!validate()){
    setToast({msg:"Please fix the errors first",type:"error"});
    return;
  }
  
  setSaving(true);
  console.log('💾 Saving profile changes...');
  
  // Prepare data for backend
  const profileData = {
    name: `${f.firstName} ${f.lastName}`.trim(),
    bio: f.bio,
    phone: f.phone,
    avatar: f.avatar
  };
  
  const result = await updateProfile(profileData);
  setSaving(false);
  
  if (result.success) {
    console.log('✅ Profile saved successfully');
    setToast({msg:"Profile updated successfully! 🎉",type:"success"});
    
    // Redirect to profile after 2 seconds
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  } else {
    console.log('❌ Profile save failed:', result.message);
    setToast({msg: result.message || "Failed to update profile",type:"error"});
  }
};
