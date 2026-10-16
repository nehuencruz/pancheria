-- =========================================================
-- Convertir al usuario del dueño en administrador.
--
-- 1. Primero creá el usuario en Supabase:
--    Authentication → Users → Add user → Create new user
--    (email + contraseña, y marcá "Auto Confirm User").
-- 2. Reemplazá el email de abajo por el del dueño.
-- 3. Ejecutá este archivo en el SQL Editor.
-- =========================================================

insert into public.admins (user_id)
select id from auth.users where lower(email) = lower('EMAIL_DEL_DUENO@ejemplo.com')
on conflict (user_id) do nothing;

-- Verificación: tiene que aparecer el email del dueño.
select u.email, a.created_at
from public.admins a
join auth.users u on u.id = a.user_id;
