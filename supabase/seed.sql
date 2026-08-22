-- Insert mock roles to test security correctly
INSERT INTO auth.users (id, email) VALUES
('b33ec366-0000-0000-0000-000000000001', 'kumudevops@gmail.com');

INSERT INTO public.users (id, email, full_name, role)
VALUES ('b33ec366-0000-0000-0000-000000000001', 'kumudevops@gmail.com', 'Kumu Admin', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
