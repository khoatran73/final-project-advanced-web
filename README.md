# Clone project

1. git clone https://github.com/khoatran73/final-project-advanced-web.git
2. cd final-project-advanced-web
3. git init 
4. npm install package.json #download node_modules file


# API
1. ADMIN add new user <br>
    method: POST <br>
    url: /admin/add-user <br> 
    data: {name, email, password, file} <br>
    content-type: "multipart/form-data" <br>
    response:  <br>
        - success: { code: 0, message: "Add a new user successfully!" } <br>
        - email_exists: { code: 1, message: "Email already exists!" } <br>
        - cloudinary error: { code: 2, message: "some error" } <br>