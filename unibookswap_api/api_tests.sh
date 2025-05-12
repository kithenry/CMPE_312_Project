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
