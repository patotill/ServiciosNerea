-- Crea el perfil completo al registrarse (RF-01, RF-04, RF-05, CU-01).
-- Corre como trigger AFTER INSERT sobre auth.users: si falla cualquier paso, Supabase
-- deshace el alta de auth. Lee la metadata que manda el front en signUp.
create or replace function public.crear_usuario_desde_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rol public.rol_usuario;
  v_id_profesional bigint;
  v_servicios jsonb := coalesce(new.raw_user_meta_data->'servicios', '[]'::jsonb);
  v_matricula text := btrim(coalesce(new.raw_user_meta_data->>'matricula', ''));
begin
  -- El alta pública solo puede ser cliente o profesional; admin nunca viene de acá
  if new.raw_user_meta_data->>'rol' = 'profesional' then
    v_rol := 'profesional';
  else
    v_rol := 'cliente';
  end if;

  insert into public.usuario (id_usuario, nombre, email, telefono, codigo_postal, rol)
  values (
    new.id,
    new.raw_user_meta_data->>'nombre',
    new.email,
    new.raw_user_meta_data->>'telefono',
    new.raw_user_meta_data->>'codigo_postal',
    v_rol
  );

  if v_rol = 'cliente' then
    insert into public.cliente (id_usuario) values (new.id);
    return new;
  end if;

  if jsonb_typeof(v_servicios) <> 'array' or jsonb_array_length(v_servicios) = 0 then
    raise exception 'El profesional necesita al menos una especialidad';
  end if;

  insert into public.profesional (id_usuario) values (new.id)
  returning id_profesional into v_id_profesional;

  insert into public.profesional_servicio (id_profesional, id_servicio)
  select v_id_profesional, (s.value)::bigint
  from jsonb_array_elements_text(v_servicios) as s(value)
  group by s.value;

  -- La matrícula se asocia a la primera especialidad (matricula exige id_servicio)
  if v_matricula <> '' then
    insert into public.matricula (id_profesional, id_servicio, numero, estado_verificacion)
    values (v_id_profesional, (v_servicios->>0)::bigint, v_matricula, 'pendiente');
  end if;

  return new;
end;
$$;

revoke execute on function public.crear_usuario_desde_auth() from public, anon, authenticated;
