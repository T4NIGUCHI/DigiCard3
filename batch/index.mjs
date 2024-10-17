import { supabase } from '../src/supabase'; // supabaseのインポート先を確認してください

async function deleteAllUsers() {
  try {
    // `users` テーブルのすべてのレコードを削除
    const { error: usersError } = await supabase
      .from('users')
      .delete()
      .neq('id', ''); // 全てのユーザーを削除

    if (usersError) {
      throw usersError;
    }

    // `user_skill` テーブルのすべてのレコードを削除
    const { error: userSkillsError } = await supabase
      .from('user_skill')
      .delete()
      .neq('id', ''); // 全てのスキル情報を削除

    if (userSkillsError) {
      throw userSkillsError;
    }

    console.log('All users and user skills have been deleted successfully.');
  } catch (error) {
    console.error('Error deleting users or user skills:', error);
  }
}

// 実行
deleteAllUsers();
