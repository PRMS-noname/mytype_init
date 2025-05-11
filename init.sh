#!/bin/bash

# 색상 출력
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

declare -A VAR_MAP

# === 외부 포트 유효성 검사 ===
check_port() {
  local port=$1
  if lsof -i :$port > /dev/null 2>&1; then return 1; else return 0; fi
}

validate_and_set_port() {
  local name=$1 default=$2 var=$3
  while true; do
    read -p "Enter external port for $name (default: $default): " input
    input=${input:-$default}
    if ! [[ "$input" =~ ^[0-9]+$ ]]; then echo -e "${RED}Invalid number${NC}"; continue; fi
    if check_port "$input"; then
      VAR_MAP[$var]=$input
      echo "${var}=${input}" >> .env
      echo -e "${GREEN}Port $input is available for $name${NC}"
      break
    else
      echo -e "${RED}Port $input is already in use${NC}"
    fi
  done
}

# === 환경변수 파싱 ===
parse_env_file() {
  local file=$1
  while IFS='=' read -r key value; do
    [[ -z "$key" || "$key" == \#* ]] && continue
    value=$(echo "$value" | sed 's/^"\(.*\)"$/\1/')
    VAR_MAP[$key]=$value
  done < "$file"
}

# === backend .env 치환 ===
resolve_backend_env() {
  local file=$1
  local temp_file="${file}.resolved"
  > "$temp_file"
  while IFS= read -r line || [ -n "$line" ]; do
    if [[ "$line" =~ ^#.* || -z "$line" ]]; then
      echo "$line" >> "$temp_file"
    elif [[ "$line" == DATABASE_URL=* ]]; then
      echo "DATABASE_URL=mongodb://${VAR_MAP[MONGO_APP_USER]}:${VAR_MAP[MONGO_APP_PASSWORD]}@database:${VAR_MAP[DATABASE_PORT]}/${VAR_MAP[MONGO_INITDB_DATABASE]}?authSource=${VAR_MAP[MONGO_AUTH_SOURCE]}" >> "$temp_file"
    elif [[ "$line" == CORS_ORIGIN=* ]]; then
      echo "CORS_ORIGIN=*" >> "$temp_file"
    else
      key=$(echo "$line" | cut -d= -f1)
      value=$(echo "$line" | cut -d= -f2-)
      for var in "${!VAR_MAP[@]}"; do
        value=$(echo "$value" | sed "s@\\\${$var}@${VAR_MAP[$var]}@g")
      done
      echo "$key=$value" >> "$temp_file"
    fi
  done < "$file"
  mv "$temp_file" "$file"
}

# === frontend .env 치환 ===
resolve_frontend_env() {
  local file=$1
  local temp_file="${file}.resolved"
  > "$temp_file"

  while IFS= read -r line || [ -n "$line" ]; do
    if [[ "$line" =~ ^#.* || -z "$line" ]]; then
      echo "$line" >> "$temp_file"
    elif [[ "$line" == VITE_API_URL=* ]]; then
      echo "VITE_API_URL=http://backend:${VAR_MAP[BACKEND_INTERNAL_PORT]}" >> "$temp_file"
    else
      echo "$line" >> "$temp_file"
    fi
  done < "$file"

  mv "$temp_file" "$file"
}


# === 병합 ===
append_to_variables_env() {
  local file=$1
  local service=$2
  echo -e "\n# From $service/.env" >> .env
  grep -v '^#' "$file" | grep '=' >> .env
}

# === Docker Compose 실행 ===
handle_docker_compose() {
  local cmd=$1 rebuild=$2
  case $cmd in
    up)    [ "$rebuild" = true ] && docker-compose --env-file .env up --build || docker-compose --env-file .env up ;;
    down)  docker-compose --env-file .env down ;;
    start) docker-compose --env-file .env start ;;
    stop)  docker-compose --env-file .env stop ;;
  esac
}

# === MAIN ===
echo -e "${YELLOW}📌 외부 포트 설정 시작...${NC}"
echo "# Auto-generated .env" > .env
validate_and_set_port "Frontend" 5173 FRONTEND_EXTERNAL_PORT
validate_and_set_port "Backend" 3000 BACKEND_EXTERNAL_PORT
validate_and_set_port "Database" 27017 DATABASE_EXTERNAL_PORT

echo -e "${YELLOW}📦 .env 파일 병합 및 치환 시작...${NC}"

# database
parse_env_file "./database/.env"
append_to_variables_env "./database/.env" "database"

# backend
resolve_backend_env "./backend/.env"
parse_env_file "./backend/.env"
VAR_MAP[BACKEND_INTERNAL_PORT]=${VAR_MAP[PORT]}
append_to_variables_env "./backend/.env" "backend"

# frontend
resolve_frontend_env "./frontend/.env"
parse_env_file "./frontend/.env"
append_to_variables_env "./frontend/.env" "frontend"

echo -e "${GREEN}✅ .env 생성 완료 및 준비 완료!${NC}"

# 실행 선택
echo -e "\n${YELLOW}Choose Docker Compose action:${NC}"
echo "1. Up (with rebuild)"
echo "2. Up (without rebuild)"
echo "3. Down"
echo "4. Start"
echo "5. Stop"
read -p "Enter choice (1-5): " choice
case $choice in
  1) handle_docker_compose up true ;;
  2) handle_docker_compose up false ;;
  3) handle_docker_compose down ;;
  4) handle_docker_compose start ;;
  5) handle_docker_compose stop ;;
  *) echo -e "${RED}Invalid choice${NC}" ;;
esac
