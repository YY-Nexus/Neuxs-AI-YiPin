-- 检查并创建表（如果不存在）
CREATE TABLE IF NOT EXISTS contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  keywords TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY,
  preferences JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS analytics_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS image_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  image_url TEXT NOT NULL,
  style TEXT,
  params JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  item_type TEXT NOT NULL, -- 'course', 'content', 'image'
  item_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- 启用行级安全策略（如果尚未启用）
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- 安全地创建策略（先检查是否存在）
DO $$
BEGIN
  -- 检查 contents 表的策略
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contents' AND policyname = '用户只能访问自己的内容'
  ) THEN
    CREATE POLICY "用户只能访问自己的内容" ON contents
      FOR ALL USING (user_id = auth.uid());
  END IF;

  -- 检查 user_preferences 表的策略
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_preferences' AND policyname = '用户只能访问自己的偏好设置'
  ) THEN
    CREATE POLICY "用户只能访问自己的偏好设置" ON user_preferences
      FOR ALL USING (user_id = auth.uid());
  END IF;

  -- 检查 course_progress 表的策略
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'course_progress' AND policyname = '用户只能访问自己的课程进度'
  ) THEN
    CREATE POLICY "用户只能访问自己的课程进度" ON course_progress
      FOR ALL USING (user_id = auth.uid());
  END IF;

  -- 检查 analytics_data 表的策略
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analytics_data' AND policyname = '用户只能访问自己的分析数据'
  ) THEN
    CREATE POLICY "用户只能访问自己的分析数据" ON analytics_data
      FOR ALL USING (user_id = auth.uid());
  END IF;

  -- 检查 image_history 表的策略
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'image_history' AND policyname = '用户只能访问自己的图片历史'
  ) THEN
    CREATE POLICY "用户只能访问自己的图片历史" ON image_history
      FOR ALL USING (user_id = auth.uid());
  END IF;

  -- 检查 bookmarks 表的策略
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookmarks' AND policyname = '用户只能访问自己的收藏'
  ) THEN
    CREATE POLICY "用户只能访问自己的收藏" ON bookmarks
      FOR ALL USING (user_id = auth.uid());
  END IF;
END
$$;

-- 创建索引以提高查询性能（如果不存在）
CREATE INDEX IF NOT EXISTS contents_user_id_idx ON contents(user_id);
CREATE INDEX IF NOT EXISTS course_progress_user_id_idx ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS analytics_data_user_id_type_date_idx ON analytics_data(user_id, type, date);
CREATE INDEX IF NOT EXISTS image_history_user_id_idx ON image_history(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_user_id_item_type_idx ON bookmarks(user_id, item_type);
