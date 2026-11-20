-- Ejecutar en Supabase SQL Editor para habilitar la agenda y las reservas.
-- Cada fila de disponibilidad representa un turno completo.

create schema if not exists agenda_private;
revoke all on schema agenda_private from public, anon, authenticated;

grant select on public.disponibilidad to anon, authenticated;
grant insert, delete on public.disponibilidad to authenticated;
grant select, insert on public.reserva to authenticated;
grant select on public.cliente to authenticated;

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
    estado = 'disponible'
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
    estado = 'reservada'
    and exists (
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
    estado = 'disponible'
    or id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
    or (
      estado = 'reservada'
      and exists (
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
    and id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
  );

drop policy if exists agenda_disponibilidad_delete
  on public.disponibilidad;
create policy agenda_disponibilidad_delete
  on public.disponibilidad
  as permissive
  for delete
  to authenticated
  using (
    estado = 'disponible'
    and id_profesional in (
      select p.id_profesional
      from public.profesional as p
      where p.id_usuario = (select auth.uid())
    )
  );

drop policy if exists agenda_disponibilidad_delete_guard
  on public.disponibilidad;
create policy agenda_disponibilidad_delete_guard
  on public.disponibilidad
  as restrictive
  for delete
  to authenticated
  using (
    estado = 'disponible'
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
    and estado = 'disponible';

  if not found then
    raise exception 'El turno seleccionado ya no está disponible.'
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
