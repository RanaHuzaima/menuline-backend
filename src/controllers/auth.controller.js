const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { CustomError } = require('../utils/errors');

const register = async (req, res) => {
  const { email, password } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  // Create user in Supabase auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) throw new CustomError(authError.message, 400);

  // Insert user into users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([
      { 
        id: authData.user.id,
        email,
        password_hash,
        role: 'admin',
      }
    ])
    .select()
    .single();

  if (userError) throw new CustomError(userError.message, 400);

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role
      }
    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Sign in with Supabase auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) throw new CustomError('Invalid credentials', 401);

  // Get user data from users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (userError) throw new CustomError('User not found', 404);

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: userData.id,
      email: userData.email,
      role: userData.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({
    status: 'success',
    data: {
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role
      },
      token
    }
  });
};

const logout = async (req, res) => {
  const { error } = await supabase.auth.signOut();

  if (error) throw new CustomError(error.message, 400);

  res.json({
    status: 'success',
    message: 'Successfully logged out'
  });
};

module.exports = {
  register,
  login,
  logout
};