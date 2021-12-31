# Clone project

1. git clone https://github.com/khoatran73/final-project-advanced-web.git
2. cd final-project-advanced-web
3. git init 
4. npm install package.json #download node_modules file


# API
1. ADMIN add new user
    method: POST
    url: /admin/add-user 
    data: {name, email, password, file}
    content-type: "multipart/form-data"
    response: 
        - success: { code: 0, message: "Add a new user successfully!" }
        - email_exists: { code: 1, message: "Email already exists!" }
        - cloudinary error: { code: 2, message: "some error" }