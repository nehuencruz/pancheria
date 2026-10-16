-- =========================================================
-- Carga inicial: el menú actual de la página.
-- Ejecutar UNA sola vez, después de schema.sql (SQL Editor → Run).
-- Si se ejecuta de nuevo no duplica nada: solo carga si no hay productos.
-- =========================================================

insert into public.categories (slug, name, sort_order) values
  ('panchos', 'Panchos', 10),
  ('tostadas', 'Tostadas', 20),
  ('salsas', 'Salsas', 30),
  ('bebidas', 'Bebidas', 40),
  ('cervezas', 'Cervezas', 50)
on conflict (slug) do nothing;

do $seed$
begin
  if exists (select 1 from public.products) then
    raise notice 'Ya hay productos cargados: no se hace nada.';
    return;
  end if;

  insert into public.products
    (category, name, description, price, price_cash, price_transfer, badge, art, featured, active, sort_order)
  values
    ('panchos', 'Pancho', 'Salchicha alemana sazonada en la panchera con morrón, en pan artesanal. Tiras de morrón sin cargo.', null, 3500, 4000, 'El de siempre', '{"sauces":["#F5B72E","#E23B2E"],"toppings":["morron"],"bg":"#F5B72E"}'::jsonb, true, true, 10),
    ('tostadas', 'Tostada de Jamón y Queso', 'Con jamón y queso de primera calidad, en pan de parmesano.', 4500, null, null, null, '{"kind":"toast","bg":"#F2B5A8"}'::jsonb, true, true, 10),
    ('salsas', 'Mayonesa', 'Natura', null, null, null, null, '{"sauces":["#FFF6DA"]}'::jsonb, false, true, 10),
    ('salsas', 'Mostaza', 'Savora', null, null, null, null, '{"sauces":["#F5B72E"]}'::jsonb, false, true, 20),
    ('salsas', 'Ketchup', 'Hellmann''s', null, null, null, null, '{"sauces":["#E23B2E"]}'::jsonb, false, true, 30),
    ('salsas', 'Salsa Golf', 'Hellmann''s', null, null, null, null, '{"sauces":["#F29A76"]}'::jsonb, false, true, 40),
    ('salsas', 'Parmesano', 'Queso parmesano rallado.', null, null, null, null, '{"sauces":["#F3E6B5"],"toppings":["parmesano"]}'::jsonb, false, true, 50),
    ('salsas', 'Cheddar', 'Cheddar fundido.', null, null, null, null, '{"sauces":["#F39C1F"]}'::jsonb, false, true, 60),
    ('salsas', 'Salsa Picante', 'Para los que se la bancan.', null, null, null, null, '{"sauces":["#C2171B"]}'::jsonb, false, true, 70),
    ('salsas', 'Mostaza con Miel', 'Pampa Gourmet', null, null, null, null, '{"sauces":["#E0A526"]}'::jsonb, false, true, 80),
    ('salsas', 'Sweet Chili', 'Salsa agridulce en base a morrón, con un toquecito de picante. Pampa Gourmet.', null, null, null, null, '{"sauces":["#E8552E"]}'::jsonb, false, true, 90),
    ('bebidas', 'Coca', null, 6000, null, null, null, '{"kind":"bottle","liquid":"#3B1A12","label":"#E23B2E","cap":"#E23B2E"}'::jsonb, false, true, 10),
    ('bebidas', 'Coca Zero', '1 litro de vidrio.', 6000, null, null, null, '{"kind":"bottle","liquid":"#3B1A12","label":"#121110","cap":"#121110"}'::jsonb, false, true, 20),
    ('bebidas', 'Fanta', null, 6000, null, null, null, '{"kind":"bottle","liquid":"#F7931E","label":"#1F5FBF","cap":"#F7931E"}'::jsonb, false, true, 30),
    ('bebidas', 'Sprite', null, 6000, null, null, null, '{"kind":"bottle","liquid":"#D9F2D0","label":"#2E9A4A","cap":"#2E9A4A"}'::jsonb, false, true, 40),
    ('bebidas', 'Línea Coca 1,75 L', null, 6000, null, null, null, '{"kind":"bottle","liquid":"#3B1A12","label":"#E23B2E","cap":"#E23B2E"}'::jsonb, false, true, 50),
    ('bebidas', 'Coquita de vidrio', 'Coquita de vidrio de 237 cm³, la compañera ideal del pancho.', 2000, null, null, null, '{"kind":"bottle","liquid":"#3B1A12","label":"#E23B2E","cap":"#E23B2E","small":true,"bg":"#B9A3F0"}'::jsonb, true, true, 60),
    ('bebidas', 'Pritty', null, 5000, null, null, null, '{"kind":"bottle","liquid":"#E6F0A8","label":"#2E9A4A","cap":"#F5B72E"}'::jsonb, false, true, 70),
    ('bebidas', 'Cunnington Tónica', null, null, null, null, null, '{"kind":"bottle","liquid":"#EAF4E4","label":"#F5B72E","cap":"#F5B72E"}'::jsonb, false, true, 80),
    ('bebidas', 'Agua', '500 cm³.', 2500, null, null, null, '{"kind":"bottle","liquid":"#CFE8F7","label":"#1F5FBF","cap":"#1F5FBF","small":true}'::jsonb, false, true, 90),
    ('bebidas', 'Agua con Gas', '500 cm³.', 2500, null, null, null, '{"kind":"bottle","liquid":"#CFE8F7","label":"#2E9A4A","cap":"#2E9A4A","small":true,"bubbles":true}'::jsonb, false, true, 100),
    ('bebidas', 'Agua Saborizada', '500 cm³.', 2500, null, null, null, '{"kind":"bottle","liquid":"#F8C9D4","label":"#C2171B","cap":"#F29A76","small":true}'::jsonb, false, true, 110),
    ('bebidas', 'Café / Cortado', null, 2000, null, null, null, '{"kind":"cup"}'::jsonb, false, true, 120),
    ('cervezas', 'Imperial Lager', 'Lata 473 cm³.', null, null, null, null, '{"kind":"can","label":"#D9A72B","band":"#121110"}'::jsonb, false, true, 10),
    ('cervezas', 'Imperial IPA', 'Lata 473 cm³.', null, null, null, null, '{"kind":"can","label":"#E58E1A","band":"#121110"}'::jsonb, false, true, 20),
    ('cervezas', 'Schneider', 'Lata 473 cm³.', null, null, null, null, '{"kind":"can","label":"#C8102E","band":"#F5B72E"}'::jsonb, false, true, 30),
    ('cervezas', 'Quilmes', 'Lata 473 cm³.', null, null, null, null, '{"kind":"can","label":"#6FB7E9","band":"#FFFFFF"}'::jsonb, false, true, 40),
    ('cervezas', 'Heineken', 'Lata 473 cm³.', null, null, null, null, '{"kind":"can","label":"#0B7A3E","band":"#C8102E"}'::jsonb, false, true, 50),
    ('cervezas', 'Cerveza Artesanal', 'Lata 473 cm³.', null, null, null, null, '{"kind":"can","label":"#7A4A22","band":"#F5B72E"}'::jsonb, false, true, 60);
end
$seed$;
