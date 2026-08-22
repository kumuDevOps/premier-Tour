-- 1. Create a trigger function to assign admin role based on your email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email = 'kumudevops@gmail.com' THEN 'admin' ELSE 'user' END
  )
  ON CONFLICT (id) DO UPDATE SET
    role = CASE WHEN EXCLUDED.email = 'kumudevops@gmail.com' THEN 'admin' ELSE EXCLUDED.role END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Make sure existing accounts are synced
INSERT INTO public.users (id, email, full_name, role)
SELECT id, email, split_part(email, '@', 1), CASE WHEN email = 'kumudevops@gmail.com' THEN 'admin' ELSE 'user' END
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  role = CASE WHEN EXCLUDED.email = 'kumudevops@gmail.com' THEN 'admin' ELSE EXCLUDED.role END;


-- 2. Create the images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Admin Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.jwt() ->> 'role' = 'admin');
