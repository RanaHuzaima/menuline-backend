const supabase = require('../../config/supabase');
const { CustomError } = require('../../utils/errors');

const getRestaurantStats = async (req, res) => {
  // Get today's orders count and revenue
  const today = new Date().toISOString().split('T')[0];
  
  const { data: orderStats, error: orderError } = await supabase
    .from('orders')
    .select('id, total_amount, status')
    .gte('created_at', today);

  if (orderError) throw new CustomError(orderError.message, 400);

  // Calculate statistics
  const stats = {
    todayOrders: orderStats.length,
    todayRevenue: orderStats.reduce((sum, order) => sum + order.total_amount, 0),
    pendingOrders: orderStats.filter(order => order.status === 'pending').length,
    preparingOrders: orderStats.filter(order => order.status === 'preparing').length
  };

  res.json({
    status: 'success',
    data: stats
  });
};

module.exports = {
  getRestaurantStats
};