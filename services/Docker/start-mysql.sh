#!/usr/bin/env bash
set -e

DATADIR="/var/lib/mysql"
SOCKETDIR="/run/mysqld"
INITFLAG="${DATADIR}/.init.done"

mkdir -p "$SOCKETDIR" "$DATADIR"
chown -R mysql:mysql "$SOCKETDIR" "$DATADIR"

# First-time data-dir init
if [ ! -d "${DATADIR}/mysql" ]; then
  echo "[mysql-init] Initializing data directory..."
  mysqld --initialize-insecure --datadir="${DATADIR}" --user=mysql
fi

echo "[mysql] starting mysqld..."
mysqld --datadir="${DATADIR}" --user=mysql --socket="${SOCKETDIR}/mysqld.sock" --bind-address=0.0.0.0 &
MYSQL_PID=$!

# Wait until MySQL is up
echo "[mysql] waiting for server..."
until mysqladmin ping --silent; do sleep 1; done

# Set root password if provided
if [ -n "${MYSQL_ROOT_PASSWORD}" ]; then
  mysql -uroot -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';" || true
fi

# One-time bootstrap SQL
if [ ! -f "${INITFLAG}" ]; then
  echo "[mysql-init] applying SQL in /app/docker/mysql-init/*.sql ..."
  for f in /app/docker/mysql-init/*.sql; do
    [ -f "$f" ] || continue
    if [ -n "${MYSQL_ROOT_PASSWORD}" ]; then
      mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" < "$f"
    else
      mysql -uroot < "$f"
    fi
  done
  touch "${INITFLAG}"
fi

wait "${MYSQL_PID}"
