
dc.up:
	@docker compose -f docker-compose.yaml up -d
	@sleep 5 # wait for db to be up
dc.down:
	@docker compose -f docker-compose.yaml down
dc.clean: dc.down
	@docker volume rm authr_authr_pgdata authr_pgboss_pgdata authr_spice_pgdata


authr.db.psql:
	@docker exec -it authr-authr-pg-1 psql -U postgres -d authr

dev:
	@pnpm run dev

up: dc.up dev
	@pnpm run dev

build:
	@pnpm run build