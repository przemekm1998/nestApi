export DOCKER_COMPOSE := docker-compose -f docker-compose.yml -f docker-compose.local.yml

up:
	$(DOCKER_COMPOSE) up --force-recreate

down:
	$(DOCKER_COMPOSE) down

shell:
	$(DOCKER_COMPOSE) run backend bash