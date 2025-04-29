
authr.db.up:
	@docker compose -f docker-compose.yaml up -d authr-pg
	@sleep 5 # wait for db to be up
authr.db.down:
	@docker compose -f docker-compose.yaml down authr-pg
authr.db.clean: authr.db.down
	@docker volume rm authr_authr_pgdata 
authr.db.psql:
	@docker exec -it authr-authr-pg-1 psql -U postgres -d authr

dev:
	@pnpm run dev

up: authr.db.up dev
	@pnpm run dev

build:
	@pnpm run build