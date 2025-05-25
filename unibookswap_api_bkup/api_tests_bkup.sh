#!/bin/bash

# Test script for UniBookSwap backend
# Usage: bash test_unibookswap.sh

# Configuration
DB_USER="root"
DB_PASS="12345678"  # Replace with your MariaDB root password
DB_NAME="unibookswap"
VENV_PATH="/home/lordkith/Venvs/UniBookSwap/bin/activate"
PROJECT_DIR="/home/lordkith/Eng. Projects/CMPE_312_Project/unibookswap"
TEST_EMAIL="test1@university.edu"
TEST_PASS="password123"
NEW_EMAIL="test3@university.edu"
NEW_PASS="password789"
API_URL="http://localhost:8000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Function to check command status
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}PASS: $1${NC}"
    else
        echo -e "${RED}FAIL: $1${NC}"
        exit 1
    fi
}

echo "Starting UniBookSwap Backend Tests..."

# 1. Test MariaDB Connectivity and Tables
echo "Testing MariaDB connectivity..."
mariadb -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME; SHOW TABLES;" > /dev/null 2>&1
check_status "MariaDB connectivity"

echo "Checking required tables..."
TABLES=$(mariadb -u "$DB_USER" -p"$DB_PASS" -N -e "SHOW TABLES FROM $DB_NAME LIKE 'users_user'; SHOW TABLES FROM $DB_NAME LIKE 'account_emailaddress'; SHOW TABLES FROM $DB_NAME LIKE 'books_book';")
if [[ $TABLES =~ "users_user" && $TABLES =~ "account_emailaddress" && $TABLES =~ "books_book" ]]; then
    check_status "Required tables exist"
else
    echo -e "${RED}FAIL: Missing tables (users_user, account_emailaddress, books_book)${NC}"
    exit 1
fi

# 2. Activate Virtual Environment and Start Django Server
echo "Activating virtual environment..."
source "$VENV_PATH"
check_status "Virtual environment activation"

echo "Starting Django server..."
cd "$PROJECT_DIR"
python manage.py runserver 8000 > server.log 2>&1 &
DJANGO_PID=$!
sleep 5  # Wait for server to start
curl -s "$API_URL/api/" > /dev/null 2>&1
check_status "Django server startup"

# 3. Test JWT Authentication (Login)
echo "Testing login endpoint..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login/" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"$TEST_PASS\"}")
if [[ $LOGIN_RESPONSE =~ "access" ]]; then
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access":"[^"]*"' | cut -d'"' -f4)
    check_status "Login endpoint"
else
    echo -e "${RED}FAIL: Login failed - $LOGIN_RESPONSE${NC}"
    kill $DJANGO_PID
    exit 1
fi

# 4. Test JWT Authentication (Registration)
echo "Testing registration endpoint..."
REG_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/registration/" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$NEW_EMAIL\", \"password1\": \"$NEW_PASS\", \"password2\": \"$NEW_PASS\"}")
if [[ $REG_RESPONSE =~ "access" ]]; then
    check_status "Registration endpoint"
else
    echo -e "${RED}FAIL: Registration failed - $REG_RESPONSE${NC}"
    kill $DJANGO_PID
    exit 1
fi

# 5. Test List Book API
echo "Testing book creation endpoint..."
BOOK_RESPONSE=$(curl -s -X POST "$API_URL/api/books/" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '{
        "title": "Python 101",
        "isbn": "1234567890123",
        "user": 1,
        "course": "CS101",
        "price": 29.99,
        "exchange_option": false,
        "status": "available"
    }')
if [[ $BOOK_RESPONSE =~ "id" ]]; then
    check_status "Book creation endpoint"
else
    echo -e "${RED}FAIL: Book creation failed - $BOOK_RESPONSE${NC}"
    kill $DJANGO_PID
    exit 1
fi

# 6. Check Email Notification (log-based)
echo "Checking email notification..."
if grep -q "New Book Listed" server.log; then
    check_status "Email notification"
else
    echo -e "${RED}FAIL: Email notification not found in logs${NC}"
    # Continue, as email may depend on SMTP setup
fi

# 7. Test Search Books API
echo "Testing book search endpoint..."
SEARCH_RESPONSE=$(curl -s "$API_URL/api/books/?search=CS101" \
    -H "Authorization: Bearer $ACCESS_TOKEN")
if [[ $SEARCH_RESPONSE =~ "Python 101" ]]; then
    check_status "Book search endpoint"
else
    echo -e "${RED}FAIL: Book search failed - $SEARCH_RESPONSE${NC}"
    kill $DJANGO_PID
    exit 1
fi

# 8. Clean Up
echo "Cleaning up..."
kill $DJANGO_PID 2>/dev/null
check_status "Server shutdown"

echo -e "${GREEN}All tests completed successfully!${NC}"
