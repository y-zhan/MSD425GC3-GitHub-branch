import json
import pymysql
from urllib.parse import parse_qs

# ================== 数据库配置 ==================
DB_CONFIG = {
    "host": "e-books-database.ctu06k2yyb1r.ap-southeast-2.rds.amazonaws.com",
    "user": "yixin",
    "password": "Clj5546284",
    "database": "elibrary_db"
}

# ================== 数据库连接 ==================
def get_connection():
    return pymysql.connect(
        host=DB_CONFIG["host"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        database=DB_CONFIG["database"],
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )

# ================== 统一响应 ==================
def cors_response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        "body": json.dumps(body, default=str)
    }

# ================== Lambda 主函数 ==================
def lambda_handler(event, context):
    print("Incoming event:", json.dumps(event))
    raw_path = event.get("rawPath") or event.get("path", "")
    path = raw_path.lower()
    method = (
        event.get("requestContext", {}).get("http", {}).get("method")
        or event.get("httpMethod")
        or "GET"
    )
    print(f"Detected path: {path}, method: {method}")

    if method == "OPTIONS":
        return cors_response(200, {"message": "CORS preflight OK"})

    try:
        conn = get_connection()
        cursor = conn.cursor()

        # ======================= [GET] =======================
        if method == "GET":

            # ---------- ✅ 图书搜索 ----------
            if "/books/search" in path:
                query_params = event.get("queryStringParameters") or {}
                keyword = query_params.get("keyword", "").strip()

                if not keyword:
                    return cors_response(400, {"error": "Please provide a search keyword."})

                search_pattern = f"%{keyword}%"
                cursor.execute("""
                    SELECT * FROM books
                    WHERE LOWER(title) LIKE LOWER(%s)
                       OR LOWER(author) LIKE LOWER(%s)
                       OR LOWER(category) LIKE LOWER(%s)
                """, (search_pattern, search_pattern, search_pattern))
                results = cursor.fetchall()

                return cors_response(200, {
                    "message": f"Search results for '{keyword}'",
                    "count": len(results),
                    "data": results
                })

            # ---------- 全部图书 ----------
            elif "/books" in path:
                cursor.execute("SELECT * FROM books")
                return cors_response(200, {"message": "Books retrieved successfully", "data": cursor.fetchall()})

            elif "/users" in path:
                cursor.execute("SELECT id, username, email, role, status, created_at FROM users")
                return cors_response(200, {"message": "Users retrieved successfully", "data": cursor.fetchall()})

            elif "/borrow_records" in path:
                cursor.execute("""
                    SELECT br.id, u.username, b.title, br.status, br.borrow_date, br.return_date
                    FROM borrow_records br
                    JOIN users u ON br.user_id = u.id
                    JOIN books b ON br.book_id = b.id
                """)
                return cors_response(200, {"message": "Borrow records retrieved successfully", "data": cursor.fetchall()})

            elif "/blacklist" in path:
                cursor.execute("""
                    SELECT bl.user_id AS id, u.username, bl.reason, bl.created_at
                    FROM blacklist bl
                    JOIN users u ON bl.user_id = u.id
                """)
                return cors_response(200, {"message": "Blacklist retrieved successfully", "data": cursor.fetchall()})

            else:
                return cors_response(200, {"message": "E-Library API active"})

        # ======================= [POST] =======================
        elif method == "POST":
            body = json.loads(event.get("body", "{}"))

            # ---------- 学生登录 ----------
            if "/login/student" in path:
                username, password = body.get("username"), body.get("password")
                cursor.execute("SELECT * FROM users WHERE username=%s AND password=%s AND role='student'", (username, password))
                user = cursor.fetchone()
                if not user:
                    return cors_response(401, {"error": "Invalid username or password"})

                # ✅ 黑名单检测
                cursor.execute("SELECT * FROM blacklist WHERE user_id=%s", (user["id"],))
                blacklisted = cursor.fetchone()
                if blacklisted:
                    return cors_response(403, {
                        "error": "Your account has been blacklisted. Login is restricted.",
                        "reason": blacklisted.get("reason", "Violation of rules")
                    })

                return cors_response(200, {"message": "Student login successful", "data": user})

            # ---------- 管理员登录 ----------
            elif "/login/admin" in path:
                username, password = body.get("username"), body.get("password")
                cursor.execute("SELECT * FROM users WHERE username=%s AND password=%s AND role='admin'", (username, password))
                user = cursor.fetchone()
                return cors_response(200, {"message": "Admin login successful", "data": user}) if user else cors_response(401, {"error": "Invalid admin credentials"})

            # ---------- 添加书籍 ----------
            elif "/books" in path:
                title, author, category = body.get("title"), body.get("author"), body.get("category")
                quantity = body.get("quantity", 1)
                available = True if quantity > 0 else False
                cursor.execute(
                    "INSERT INTO books (title, author, category, quantity, available) VALUES (%s, %s, %s, %s, %s)",
                    (title, author, category, quantity, available)
                )
                return cors_response(201, {"message": "Book added successfully"})

            # ---------- 借书 ----------
            elif "/borrow" in path:
                user_id, book_id, days = body.get("user_id"), body.get("book_id"), body.get("days", 7)
                cursor.execute("SELECT * FROM blacklist WHERE user_id=%s", (user_id,))
                if cursor.fetchone():
                    return cors_response(403, {"error": "Your account is restricted. Borrowing not allowed."})

                cursor.execute("SELECT quantity FROM books WHERE id=%s", (book_id,))
                book = cursor.fetchone()
                if not book or book["quantity"] <= 0:
                    return cors_response(400, {"error": "Book unavailable"})

                cursor.execute("""
                    INSERT INTO borrow_records (user_id, book_id, status, borrow_date, return_date)
                    VALUES (%s, %s, 'borrowed', NOW(), DATE_ADD(NOW(), INTERVAL %s DAY))
                """, (user_id, book_id, days))
                cursor.execute("UPDATE books SET quantity = quantity - 1, available = (quantity - 1 > 0) WHERE id=%s", (book_id,))
                return cors_response(201, {"message": "Book borrowed successfully"})

            # ---------- 添加黑名单 ----------
            elif "/blacklist/add" in path:
                user_id = body.get("user_id")
                reason = body.get("reason", "Violation of rules")
                if not user_id:
                    return cors_response(400, {"error": "Missing user_id"})
                cursor.execute("SELECT * FROM blacklist WHERE user_id=%s", (user_id,))
                if cursor.fetchone():
                    return cors_response(400, {"error": "User already in blacklist"})
                cursor.execute("INSERT INTO blacklist (user_id, reason, created_at) VALUES (%s, %s, NOW())", (user_id, reason))
                return cors_response(200, {"message": f"User {user_id} added to blacklist"})

        # ======================= [PUT] =======================
        elif method == "PUT":
            # ---------- 还书 ----------
            if "/borrow/return/" in path:
                record_id = path.split("/")[-1]
                cursor.execute("SELECT book_id, status FROM borrow_records WHERE id=%s", (record_id,))
                row = cursor.fetchone()
                if not row:
                    return cors_response(404, {"error": "Borrow record not found"})
                if row["status"] != "borrowed":
                    return cors_response(400, {"error": "Book already returned"})

                cursor.execute("UPDATE borrow_records SET status='returned', return_date=NOW() WHERE id=%s", (record_id,))
                cursor.execute("UPDATE books SET quantity = quantity + 1, available = TRUE WHERE id=%s", (row["book_id"],))
                return cors_response(200, {"message": f"Book ID {row['book_id']} returned successfully"})

            # ---------- 修改书籍 ----------
            elif "/books/" in path:
                book_id = path.split("/")[-1]
                body = json.loads(event.get("body", "{}"))
                title = body.get("title")
                author = body.get("author")
                category = body.get("category")
                cursor.execute("UPDATE books SET title=%s, author=%s, category=%s WHERE id=%s", (title, author, category, book_id))
                return cors_response(200, {"message": f"Book ID {book_id} updated successfully"})

        # ======================= [DELETE] =======================
        elif method == "DELETE":
            # ---------- 删除图书 ----------
            if "/books/" in path:
                book_id = path.split("/")[-1]
                cursor.execute("DELETE FROM books WHERE id=%s", (book_id,))
                return cors_response(200, {"message": f"Book ID {book_id} deleted successfully"})

            # ---------- 移除黑名单 ----------
            elif "/blacklist/remove/" in path:
                user_id = path.split("/")[-1]
                cursor.execute("DELETE FROM blacklist WHERE user_id=%s", (user_id,))
                return cors_response(200, {"message": f"User {user_id} removed from blacklist"})

        # ======================= Default =======================
        return cors_response(404, {"error": "Invalid route or method"})

    except Exception as e:
        print("Error:", str(e))
        return cors_response(500, {"error": "Internal server error", "details": str(e)})

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass
