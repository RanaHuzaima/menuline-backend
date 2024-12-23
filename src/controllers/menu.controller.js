const supabase = require('../config/supabase');
const { CustomError } = require('../utils/errors');

const getAllMenuItems = async (req, res) => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('category');

  if (error) throw new CustomError(error.message, 400);

  res.json({
    status: 'success',
    data: data
  });
};

const getMenuItem = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new CustomError(error.message, 400);
  if (!data) throw new CustomError('Menu item not found', 404);

  res.json({
    status: 'success',
    data: data
  });
};

const createMenuItem = async (req, res) => {
  const { name, description, price, category } = req.body;

  const { data, error } = await supabase
    .from('menu_items')
    .insert([
      { name, description, price, category }
    ])
    .select()
    .single();

  if (error) throw new CustomError(error.message, 400);

  res.status(201).json({
    status: 'success',
    data: data
  });
};

const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new CustomError(error.message, 400);
  if (!data) throw new CustomError('Menu item not found', 404);

  res.json({
    status: 'success',
    data: data
  });
};

const deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) throw new CustomError(error.message, 400);

  res.status(204).send();
};

module.exports = {
  getAllMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};