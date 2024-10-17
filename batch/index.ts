import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの作成
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteAllData() {
  try {
    // user_skillテーブルの全データを削除
    const { error: userSkillError } = await supabase
      .from('user_skill')
      .delete()
      .not('id', 'is', null); // idがnullでない行を削除

    if (userSkillError) {
      throw userSkillError;
    }

    // usersテーブルの全データを削除
    const { error: usersError } = await supabase
      .from('users')
      .delete()
      .not('user_id', 'is', null); // user_idがnullでない行を削除

    if (usersError) {
      throw usersError;
    }

    console.log('All data from users and user_skill tables deleted successfully.');
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}

// 関数の実行
deleteAllData();
