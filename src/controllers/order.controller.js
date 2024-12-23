const supabase = require('../config/supabase');
const { CustomError } = require('../utils/errors');

const getAllOrders = async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        menu_items (name, price)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw new CustomError(error.message, 400);

  res.json({
    status: 'success',
    data: data
  });
};

const getOrder = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        menu_items (name, price)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw new CustomError(error.message, 400);
  if (!data) throw new CustomError('Order not found', 404);

  res.json({
    status: 'success',
    data: data
  });
};

const createOrder = async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id;

  // Calculate total amount from items
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([
      { user_id: userId, total_amount: total }
    ])
    .select()
    .single();

  if (orderError) throw new CustomError(orderError.message, 400);

  // Insert order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    price_at_time: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw new CustomError(itemsError.message, 400);

  res.status(201).json({
    status: 'success',
    data: order
  });
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new CustomError(error.message, 400);
  if (!data) throw new CustomError('Order not found', 404);

  res.json({
    status: 'success',
    data: data
  });
};

const cancelOrder = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new CustomError(error.message, 400);
  if (!data) throw new CustomError('Order not found', 404);

  res.json({
    status: 'success',
    data: data
  });
};

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder
};