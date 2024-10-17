import { createClient } from '@supabase/supabase-js';
import { format, subDays } from 'date-fns';
import dotenv from 'dotenv';

// 環境変数をロード
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function deletePreviousDayData() {
  // 前日の日時を取得
  const yesterday = subDays(new Date(), 1);
  const formattedDate = format(yesterday, 'yyyy-MM-dd');

  // 前日作成された users のレコードを削除
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .delete()
    .eq('created_at', formattedDate);

  if (usersError) {
    console.error('Error deleting users:', usersError);
    return;
  }
  console.log('Deleted users:', usersData);

  // 前日作成された user_skill のレコードを削除
  const { data: userSkillsData, error: userSkillsError } = await supabase
    .from('user_skill')
    .delete()
    .eq('created_at', formattedDate);

  if (userSkillsError) {
    console.error('Error deleting user_skill:', userSkillsError);
    return;
  }
  console.log('Deleted user_skill:', userSkillsData);
}

// バッチ処理を実行
deletePreviousDayData().catch((error) => {
  console.error('Error executing batch process:', error);
});
