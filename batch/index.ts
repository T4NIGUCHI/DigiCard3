import { supabase } from '../src/supabase';

async function deleteUsers() {
  try {
    // usersテーブルの削除
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .lt('created_at', new Date().toISOString())
      .select('user_id');

    if (userError) throw userError;

    // user_skillテーブルの削除
    const { error: skillError } = await supabase
      .from('user_skill')
      .delete()
      .lt('created_at', new Date().toISOString())
      .select('user_id');

    if (skillError) throw skillError;

    console.log('Users and user skills deleted successfully.');
  } catch (error) {
    console.error('Error deleting users or user skills:', error);
  }
}

deleteUsers();
