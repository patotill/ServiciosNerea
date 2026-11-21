-- Ejecutar en Supabase SQL Editor para habilitar la agenda y las reservas.
-- Cada fila de disponibilidad representa un turno completo.
-- Los horarios retirados se conservan para mantener las reservas históricas.

create schema if not exists agenda_private;
revoke all on schema agenda_private from public, anon, authenticated;

alter table public.disponibilidad
  add column if not exists retirada boolean not null default false;

grant select on public.disponibilidad to anon, authenticated;
grant insert on public.disponibilidad to authenticated;
revoke delete, update on public.disponibilidad from anon, authenticated;
grant update (retirada) on public.disponibilidad to authenticated;
grant select, insert on public.reserva to authenticated;
grant select on public.cliente to authenticated;
revoke update on public.reserva from anon, authenticated;
grant update (id_disponibilidad, descripcion_trabajo, estado)
  on public.reserva to authenticated;

alter table public.disponibilidad enable row level security;
alter table public.reserva enable row level security;

drop policy if exists agenda_reserva_select
  on public.reserva;
create policy agenda_reserva_select
  on public.reserva
  as permissive
  for select
  to authenticated
  using (
    public.es_admin()
    or id_cliente in (
      select c.id_cliente
      from public.cliente as c
      where c.id_usuario = (select auth.uid())
    )
    or id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
  );

drop policy if exists agenda_reserva_select_guard
  on public.reserva;
create policy agenda_reserva_select_guard
  on public.reserva
  as restrictive
  for select
  to authenticated
  using (
    public.es_admin()
    or id_cliente in (
      select c.id_cliente
      from public.cliente as c
      where c.id_usuario = (select auth.uid())
    )
    or id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
  );

drop policy if exists agenda_cliente_select_self
  on public.cliente;
create policy agenda_cliente_select_self
  on public.cliente
  as permissive
  for select
  to authenticated
  using (id_usuario = (select auth.uid()));

drop policy if exists agenda_disponibilidad_select
  on public.disponibilidad;
create policy agenda_disponibilidad_select
  on public.disponibilidad
  as permissive
  for select
  to anon, authenticated
  using (
    (estado = 'disponible' and not retirada)
    or id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
  );

drop policy if exists agenda_disponibilidad_reserva_propia
  on public.disponibilidad;
create policy agenda_disponibilidad_reserva_propia
  on public.disponibilidad
  as permissive
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.reserva as r
      where r.id_disponibilidad = disponibilidad.id_disponibilidad
        and (
          r.id_cliente in (
            select c.id_cliente
            from public.cliente as c
            where c.id_usuario = (select auth.uid())
          )
          or r.id_profesional in (
            select p.id_profesional
            from public.profesional as p
            where p.id_usuario = (select auth.uid())
          )
        )
    )
  );

drop policy if exists agenda_disponibilidad_select_guard
  on public.disponibilidad;
create policy agenda_disponibilidad_select_guard
  on public.disponibilidad
  as restrictive
  for select
  to authenticated
  using (
    id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
    or (estado = 'disponible' and not retirada)
    or exists (
      select 1
      from public.reserva as r
      where r.id_disponibilidad = disponibilidad.id_disponibilidad
        and (
          r.id_cliente in (
            select c.id_cliente
            from public.cliente as c
            where c.id_usuario = (select auth.uid())
          )
          or r.id_profesional in (
            select p.id_profesional
            from public.profesional as p
            where p.id_usuario = (select auth.uid())
          )
        )
      )
  );

drop policy if exists agenda_disponibilidad_anon_guard
  on public.disponibilidad;
create policy agenda_disponibilidad_anon_guard
  on public.disponibilidad
  as restrictive
  for select
  to anon
  using (
    estado = 'disponible'
    and not retirada
  );

drop policy if exists agenda_disponibilidad_insert
  on public.disponibilidad;
create policy agenda_disponibilidad_insert
  on public.disponibilidad
  as permissive
  for insert
  to authenticated
  with check (
    estado = 'disponible'
    and not retirada
    and id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
  );

drop policy if exists agenda_disponibilidad_insert_guard
  on public.disponibilidad;
create policy agenda_disponibilidad_insert_guard
  on public.disponibilidad
  as restrictive
  for insert
  to authenticated
  with check (
    estado = 'disponible'
    and not retirada
    and id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
  );

drop policy if exists agenda_disponibilidad_delete
  on public.disponibilidad;
drop policy if exists agenda_disponibilidad_delete_guard
  on public.disponibilidad;
drop policy if exists agenda_disponibilidad_retirar
  on public.disponibilidad;
create policy agenda_disponibilidad_retirar
  on public.disponibilidad
  as permissive
  for update
  to authenticated
  using (
    estado = 'disponible'
    and not retirada
    and id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
  )
  with check (
    estado = 'disponible'
    and retirada
    and id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
  );

drop policy if exists agenda_disponibilidad_retirar_guard
  on public.disponibilidad;
create policy agenda_disponibilidad_retirar_guard
  on public.disponibilidad
  as restrictive
  for update
  to authenticated
  using (
    estado = 'disponible'
    and not retirada
    and id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
  )
  with check (
    estado = 'disponible'
    and retirada
    and id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
  );

drop policy if exists agenda_reserva_insert
  on public.reserva;
create policy agenda_reserva_insert
  on public.reserva
  as permissive
  for insert
  to authenticated
  with check (
    estado = 'pendiente'
    and id_cliente in (
      select c.id_cliente
      from public.cliente as c
      where c.id_usuario = (select auth.uid())
    )
  );

drop policy if exists agenda_reserva_insert_guard
  on public.reserva;
create policy agenda_reserva_insert_guard
  on public.reserva
  as restrictive
  for insert
  to authenticated
  with check (
    estado = 'pendiente'
    and id_cliente in (
      select c.id_cliente
      from public.cliente as c
      where c.id_usuario = (select auth.uid())
    )
  );

drop policy if exists agenda_reserva_update
  on public.reserva;
create policy agenda_reserva_update
  on public.reserva
  as permissive
  for update
  to authenticated
  using (
    estado = 'pendiente'
    and id_cliente in (
      select c.id_cliente
      from public.cliente as c
      where c.id_usuario = (select auth.uid())
    )
  )
  with check (
    estado in ('pendiente', 'cancelada')
    and id_cliente in (
      select c.id_cliente
      from public.cliente as c
      where c.id_usuario = (select auth.uid())
    )
  );

drop policy if exists agenda_reserva_update_profesional
  on public.reserva;
create policy agenda_reserva_update_profesional
  on public.reserva
  as permissive
  for update
  to authenticated
  using (
    estado in ('pendiente', 'confirmada')
    and id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
    and exists (
      select 1
      from public.usuario as u
      where u.id_usuario = (select auth.uid())
        and u.rol = 'profesional'
        and u.activo
    )
  )
  with check (
    estado in ('confirmada', 'rechazada', 'completada')
    and id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
    and exists (
      select 1
      from public.usuario as u
      where u.id_usuario = (select auth.uid())
        and u.rol = 'profesional'
        and u.activo
    )
  );

drop policy if exists agenda_reserva_update_guard
  on public.reserva;
create policy agenda_reserva_update_guard
  on public.reserva
  as restrictive
  for update
  to authenticated
  using (
    (
      estado = 'pendiente'
      and id_cliente in (
        select c.id_cliente
        from public.cliente as c
        where c.id_usuario = (select auth.uid())
      )
    )
    or (
      estado in ('pendiente', 'confirmada')
      and id_profesional in (
        select p.id_profesional
        from public.profesional as p
        where p.id_usuario = (select auth.uid())
      )
      and exists (
        select 1
        from public.usuario as u
        where u.id_usuario = (select auth.uid())
          and u.rol = 'profesional'
          and u.activo
      )
    )
  )
  with check (
    (
      estado in ('pendiente', 'cancelada')
      and id_cliente in (
        select c.id_cliente
        from public.cliente as c
        where c.id_usuario = (select auth.uid())
      )
    )
    or (
      estado in ('confirmada', 'rechazada', 'completada')
      and id_profesional in (
        select p.id_profesional
        from public.profesional as p
        where p.id_usuario = (select auth.uid())
      )
      and exists (
        select 1
        from public.usuario as u
        where u.id_usuario = (select auth.uid())
          and u.rol = 'profesional'
          and u.activo
      )
    )
  );

do $$
begin
  if exists (
    select 1
    from public.reserva
    where estado in ('pendiente', 'confirmada')
    group by id_disponibilidad
    having count(*) > 1
  ) then
    raise exception
      'Hay turnos con más de una reserva pendiente o confirmada; resolvelos antes de continuar.';
  end if;
end;
$$;

create unique index if not exists reserva_disponibilidad_activa_uidx
  on public.reserva (id_disponibilidad)
  where estado in ('pendiente', 'confirmada');

create or replace function agenda_private.validar_disponibilidad()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_clave bigint;
begin
  if (select auth.uid()) is null
    or new.estado is distinct from 'disponible'
    or new.retirada is distinct from false
    or new.hora_inicio >= new.hora_fin
    or extract(epoch from (new.hora_fin - new.hora_inicio))
      not in (3600, 7200, 10800)
    or not exists (
      select 1
      from public.profesional as p
      where p.id_profesional = new.id_profesional
        and p.id_usuario = (select auth.uid())
    )
  then
    raise exception 'No podés publicar esta disponibilidad.'
      using errcode = '42501';
  end if;

  v_clave := pg_catalog.hashtextextended(
    new.id_profesional::text || ':' || new.fecha::text,
    0
  );
  perform pg_catalog.pg_advisory_xact_lock(v_clave);

  if exists (
    select 1
    from public.disponibilidad as d
    where d.id_profesional = new.id_profesional
      and d.fecha = new.fecha
      and not d.retirada
      and d.hora_inicio < new.hora_fin
      and d.hora_fin > new.hora_inicio
  ) then
    raise exception 'El horario se superpone con otra disponibilidad.'
      using errcode = '23P01';
  end if;

  return new;
end;
$$;

create or replace function agenda_private.reservar_disponibilidad()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_disponibilidad public.disponibilidad%rowtype;
  v_clave bigint;
begin
  if (select auth.uid()) is null
    or new.estado is distinct from 'pendiente'
    or new.tipo_reserva is null
    or new.tipo_reserva not in ('visita', 'trabajo')
    or not exists (
      select 1
      from public.cliente as c
      where c.id_cliente = new.id_cliente
        and c.id_usuario = (select auth.uid())
    )
  then
    raise exception 'No podés crear esta reserva.'
      using errcode = '42501';
  end if;

  select d.*
  into v_disponibilidad
  from public.disponibilidad as d
  where d.id_disponibilidad = new.id_disponibilidad;

  if not found or v_disponibilidad.id_profesional <> new.id_profesional then
    raise exception 'El turno seleccionado ya no está disponible.'
      using errcode = '23505';
  end if;

  v_clave := pg_catalog.hashtextextended(
    new.id_profesional::text || ':' || v_disponibilidad.fecha::text,
    0
  );
  perform pg_catalog.pg_advisory_xact_lock(v_clave);

  select d.*
  into v_disponibilidad
  from public.disponibilidad as d
  where d.id_disponibilidad = new.id_disponibilidad
    and d.estado = 'disponible'
    and not d.retirada
  for update;

  if not found
    or v_disponibilidad.id_profesional <> new.id_profesional
    or not exists (
      select 1
      from public.profesional_servicio as ps
      where ps.id_profesional = new.id_profesional
        and ps.id_servicio = new.id_servicio
    )
  then
    raise exception 'El turno o el servicio ya no está disponible.'
      using errcode = '23505';
  end if;

  if exists (
    select 1
    from public.reserva as r
    join public.disponibilidad as d
      on d.id_disponibilidad = r.id_disponibilidad
    where r.id_profesional = new.id_profesional
      and r.estado in ('pendiente', 'confirmada')
      and d.fecha = v_disponibilidad.fecha
      and d.hora_inicio < v_disponibilidad.hora_fin
      and d.hora_fin > v_disponibilidad.hora_inicio
  ) then
    raise exception 'Ese horario se superpone con una reserva activa.'
      using errcode = '23P01';
  end if;

  update public.disponibilidad
  set estado = 'reservada'
  where id_disponibilidad = new.id_disponibilidad
    and estado = 'disponible'
    and not retirada;

  if not found then
    raise exception 'El turno seleccionado ya no está disponible.'
      using errcode = '23505';
  end if;

  return new;
end;
$$;

create or replace function agenda_private.validar_actualizacion_reserva()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_disponibilidad_anterior public.disponibilidad%rowtype;
  v_disponibilidad_nueva public.disponibilidad%rowtype;
  v_clave_anterior bigint;
  v_clave_nueva bigint;
  v_ahora_local timestamp without time zone;
begin
  if (select auth.uid()) is null then
    raise exception 'No podés modificar esta reserva.'
      using errcode = '42501';
  end if;

  if exists (
    select 1
    from public.profesional as p
    join public.usuario as u
      on u.id_usuario = p.id_usuario
    where p.id_profesional = old.id_profesional
      and p.id_usuario = (select auth.uid())
      and u.rol = 'profesional'
      and u.activo
  ) then
    if (
        old.estado is distinct from 'pendiente'
        and old.estado is distinct from 'confirmada'
      )
      or (
        old.estado = 'pendiente'
        and new.estado is distinct from 'confirmada'
        and new.estado is distinct from 'rechazada'
      )
      or (
        old.estado = 'confirmada'
        and new.estado is distinct from 'completada'
      )
      or (to_jsonb(new) - 'estado')
        is distinct from (to_jsonb(old) - 'estado')
    then
      raise exception 'Solo podés gestionar reservas según su estado actual.'
        using errcode = '42501';
    end if;

    return new;
  end if;

  if not exists (
      select 1
      from public.usuario as u
      where u.id_usuario = (select auth.uid())
        and u.rol = 'cliente'
        and u.activo
    )
    or not exists (
      select 1
      from public.cliente as c
      where c.id_cliente = old.id_cliente
        and c.id_usuario = (select auth.uid())
    )
  then
    raise exception 'No podés modificar esta reserva.'
      using errcode = '42501';
  end if;

  if old.estado is distinct from 'pendiente' then
    raise exception 'Solo podés gestionar reservas pendientes.'
      using errcode = '42501';
  end if;

  if new.estado = 'cancelada' then
    if (to_jsonb(new) - 'estado')
      is distinct from (to_jsonb(old) - 'estado')
    then
      raise exception 'La baja no puede modificar los datos de la reserva.'
        using errcode = '42501';
    end if;

    select d.*
    into v_disponibilidad_anterior
    from public.disponibilidad as d
    where d.id_disponibilidad = old.id_disponibilidad
      and d.id_profesional = old.id_profesional
      and d.estado = 'reservada'
      and not d.retirada
    for update;

    if not found then
      raise exception 'El turno de la reserva ya no está disponible.'
        using errcode = '23505';
    end if;

    v_ahora_local := clock_timestamp()
      at time zone 'America/Argentina/Buenos_Aires';
    if v_disponibilidad_anterior.fecha + v_disponibilidad_anterior.hora_inicio
      <= v_ahora_local
    then
      raise exception 'No podés gestionar una reserva cuyo turno ya comenzó.'
        using errcode = '22023';
    end if;

    return new;
  end if;

  if new.estado is distinct from 'pendiente'
    or (to_jsonb(new) - array['id_disponibilidad', 'descripcion_trabajo'])
      is distinct from
      (to_jsonb(old) - array['id_disponibilidad', 'descripcion_trabajo'])
    or char_length(coalesce(new.descripcion_trabajo, '')) > 1000
  then
    raise exception 'Solo podés cambiar el turno y la descripción.'
      using errcode = '42501';
  end if;

  select d.*
  into v_disponibilidad_anterior
  from public.disponibilidad as d
  where d.id_disponibilidad = old.id_disponibilidad
    and d.id_profesional = old.id_profesional
    and d.estado = 'reservada'
    and not d.retirada;

  if not found then
    raise exception 'El turno actual de la reserva ya no está disponible.'
      using errcode = '23505';
  end if;

  v_ahora_local := clock_timestamp()
    at time zone 'America/Argentina/Buenos_Aires';
  if v_disponibilidad_anterior.fecha + v_disponibilidad_anterior.hora_inicio
    <= v_ahora_local
  then
    raise exception 'No podés gestionar una reserva cuyo turno ya comenzó.'
      using errcode = '22023';
  end if;

  if new.id_disponibilidad = old.id_disponibilidad then
    return new;
  end if;

  select d.*
  into v_disponibilidad_nueva
  from public.disponibilidad as d
  where d.id_disponibilidad = new.id_disponibilidad
    and d.id_profesional = old.id_profesional
    and not d.retirada;

  if not found then
    raise exception 'Elegí un turno disponible del mismo profesional.'
      using errcode = '23505';
  end if;

  v_clave_anterior := pg_catalog.hashtextextended(
    old.id_profesional::text || ':' || v_disponibilidad_anterior.fecha::text,
    0
  );
  v_clave_nueva := pg_catalog.hashtextextended(
    old.id_profesional::text || ':' || v_disponibilidad_nueva.fecha::text,
    0
  );

  if v_clave_anterior < v_clave_nueva then
    perform pg_catalog.pg_advisory_xact_lock(v_clave_anterior);
    perform pg_catalog.pg_advisory_xact_lock(v_clave_nueva);
  elsif v_clave_nueva < v_clave_anterior then
    perform pg_catalog.pg_advisory_xact_lock(v_clave_nueva);
    perform pg_catalog.pg_advisory_xact_lock(v_clave_anterior);
  else
    perform pg_catalog.pg_advisory_xact_lock(v_clave_anterior);
  end if;

  perform d.id_disponibilidad
  from public.disponibilidad as d
  where d.id_disponibilidad in (
    old.id_disponibilidad,
    new.id_disponibilidad
  )
  order by d.id_disponibilidad
  for update;

  v_ahora_local := clock_timestamp()
    at time zone 'America/Argentina/Buenos_Aires';

  select d.*
  into v_disponibilidad_anterior
  from public.disponibilidad as d
  where d.id_disponibilidad = old.id_disponibilidad
    and d.id_profesional = old.id_profesional
    and d.estado = 'reservada'
    and not d.retirada;

  if not found then
    raise exception 'El turno actual de la reserva ya no está disponible.'
      using errcode = '23505';
  end if;

  if v_disponibilidad_anterior.fecha + v_disponibilidad_anterior.hora_inicio
    <= v_ahora_local
  then
    raise exception 'No podés gestionar una reserva cuyo turno ya comenzó.'
      using errcode = '22023';
  end if;

  select d.*
  into v_disponibilidad_nueva
  from public.disponibilidad as d
  where d.id_disponibilidad = new.id_disponibilidad
    and d.id_profesional = old.id_profesional
    and d.estado = 'disponible'
    and not d.retirada;

  if not found then
    raise exception 'Ese turno ya no está disponible.'
      using errcode = '23505';
  end if;

  if v_disponibilidad_nueva.fecha + v_disponibilidad_nueva.hora_inicio
    <= v_ahora_local
  then
    raise exception 'Elegí un turno futuro.'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.reserva as r
    join public.disponibilidad as d
      on d.id_disponibilidad = r.id_disponibilidad
    where r.id_reserva <> old.id_reserva
      and r.id_profesional = old.id_profesional
      and r.estado in ('pendiente', 'confirmada')
      and d.fecha = v_disponibilidad_nueva.fecha
      and d.hora_inicio < v_disponibilidad_nueva.hora_fin
      and d.hora_fin > v_disponibilidad_nueva.hora_inicio
  ) then
    raise exception 'Ese turno se superpone con una reserva activa.'
      using errcode = '23P01';
  end if;

  update public.disponibilidad
  set estado = 'reservada'
  where id_disponibilidad = new.id_disponibilidad
    and estado = 'disponible'
    and not retirada;

  if not found then
    raise exception 'Ese turno ya no está disponible.'
      using errcode = '23505';
  end if;

  update public.disponibilidad
  set estado = 'disponible'
  where id_disponibilidad = old.id_disponibilidad
    and estado = 'reservada';

  if not found then
    raise exception 'El turno actual de la reserva ya no está disponible.'
      using errcode = '23505';
  end if;

  return new;
end;
$$;

create or replace function agenda_private.liberar_disponibilidad_cancelada()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.estado in ('pendiente', 'confirmada')
    and new.estado in ('rechazada', 'cancelada')
  then
    update public.disponibilidad
    set estado = 'disponible'
    where id_disponibilidad = new.id_disponibilidad
      and estado = 'reservada';
  end if;

  return new;
end;
$$;

create or replace function public.agenda_contactos_reservas_profesional()
returns table (
  id_reserva bigint,
  nombre text,
  email text,
  telefono text
)
language sql
stable
security definer
set search_path = ''
as $$
  select r.id_reserva, cliente_usuario.nombre, cliente_usuario.email,
    cliente_usuario.telefono
  from public.reserva as r
  join public.profesional as p
    on p.id_profesional = r.id_profesional
  join public.usuario as profesional_usuario
    on profesional_usuario.id_usuario = p.id_usuario
  join public.cliente as c
    on c.id_cliente = r.id_cliente
  join public.usuario as cliente_usuario
    on cliente_usuario.id_usuario = c.id_usuario
  where profesional_usuario.id_usuario = (select auth.uid())
    and profesional_usuario.rol = 'profesional'
    and profesional_usuario.activo;
$$;

revoke all on function public.agenda_contactos_reservas_profesional()
  from public, anon, authenticated;
grant execute on function public.agenda_contactos_reservas_profesional()
  to authenticated;

drop trigger if exists agenda_validar_disponibilidad
  on public.disponibilidad;
create trigger agenda_validar_disponibilidad
  before insert on public.disponibilidad
  for each row
  execute function agenda_private.validar_disponibilidad();

drop trigger if exists agenda_reservar_disponibilidad
  on public.reserva;
create trigger agenda_reservar_disponibilidad
  before insert on public.reserva
  for each row
  execute function agenda_private.reservar_disponibilidad();

drop trigger if exists agenda_validar_actualizacion_reserva
  on public.reserva;
create trigger agenda_validar_actualizacion_reserva
  before update on public.reserva
  for each row
  execute function agenda_private.validar_actualizacion_reserva();

drop trigger if exists agenda_liberar_disponibilidad
  on public.reserva;
create trigger agenda_liberar_disponibilidad
  after update of estado on public.reserva
  for each row
  execute function agenda_private.liberar_disponibilidad_cancelada();

revoke all on function agenda_private.validar_disponibilidad()
  from public, anon, authenticated;
revoke all on function agenda_private.reservar_disponibilidad()
  from public, anon, authenticated;
revoke all on function agenda_private.validar_actualizacion_reserva()
  from public, anon, authenticated;
revoke all on function agenda_private.liberar_disponibilidad_cancelada()
  from public, anon, authenticated;

do $$
declare
  v_secuencia text;
begin
  v_secuencia := pg_catalog.pg_get_serial_sequence(
    'public.disponibilidad',
    'id_disponibilidad'
  );
  if v_secuencia is not null then
    execute pg_catalog.format(
      'grant usage, select on sequence %s to authenticated',
      v_secuencia
    );
  end if;

  v_secuencia := pg_catalog.pg_get_serial_sequence(
    'public.reserva',
    'id_reserva'
  );
  if v_secuencia is not null then
    execute pg_catalog.format(
      'grant usage, select on sequence %s to authenticated',
      v_secuencia
    );
  end if;
end;
$$;
