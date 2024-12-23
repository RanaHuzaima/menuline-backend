const supabase = require('../../config/supabase');
const { CustomError } = require('../../utils/errors');

const getInventoryStatus = async (req, res) => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('item_name');

  if (error) throw new CustomError(error.message, 400);

  res.json({
    status: 'success',
    data: data
  });
};

const updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const { data, error } = await supabase
    .from('inventory')
    .update({ 
      quantity,
      last_updated: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new CustomError(error.message, 400);
  if (!data) throw new CustomError('Inventory item not found', 404);

  res.json({
    status: 'success',
    data: data
  });
};

module.exports = {
  getInventoryStatus,
  updateInventoryItem
};