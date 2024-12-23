const supabase = require('../../config/supabase');
const { CustomError } = require('../../utils/errors');

const getTableStatus = async (req, res) => {
  const { data, error } = await supabase
    .from('tables')
    .select(`
      *,
      reservations (*)
    `)
    .order('number');

  if (error) throw new CustomError(error.message, 400);

  res.json({
    status: 'success',
    data: data
  });
};

const createReservation = async (req, res) => {
  const { table_id, reservation_time } = req.body;
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from('reservations')
    .insert([
      { table_id, user_id, reservation_time }
    ])
    .select()
    .single();

  if (error) throw new CustomError(error.message, 400);

  res.status(201).json({
    status: 'success',
    data: data
  });
};

module.exports = {
  getTableStatus,
  createReservation
};