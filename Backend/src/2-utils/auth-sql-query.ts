class AuthSqlQuery {

    public findIfUserExist = `
        SELECT * FROM users
        WHERE userId = ? OR 'email' = ?  
    `;

    public registerPart1 = `
        INSERT INTO users (userId, email, password, roleId)
        VALUES(?, ?, ?, ?)
    `;

    public registerPart2 = `
        UPDATE users 
        SET
            firstName = ?,
            lastName = ?,
            city = ?,
            street = ?
        WHERE userId = ?
    `;

    public login = `
        SELECT * FROM users
        WHERE email = ? AND password = ?
    `;

}

const authSqlQuery = new AuthSqlQuery();

export default authSqlQuery;