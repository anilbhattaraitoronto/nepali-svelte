const DB = require("../database/createtables");
const jwt = require("jsonwebtoken");
const { authsecret } = require("../secrets.js");

process.on("exit", () => {
  DB.close();
});

exports.createPost = (req, res) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({ message: "no token in headers" });
  } else {
    jwt.verify(token, authsecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        req.email = decoded.email;
        let getUserStmt = DB.prepare(`SELECT * FROM users WHERE email=?;`);
        let user = getUserStmt.get(req.email);
        if (user.is_admin === 1) {
          const { title, author, content } = req.body;
          const createPostStmt = DB.prepare(
            `INSERT INTO posts (title, author, content) VALUES(?,?,?);`,
          );
          const newpostId =
            createPostStmt.run(title, author, content).lastInsertRowid;
          const getNewPost = DB.prepare(`SELECT * FROM posts WHERE id = ?;`);
          const newpost = getNewPost.get(newpostId);
          res.status(200).json(newpost);
        } else {
          res.status(401).json({ message: "Not authorized to add post" });
        }
      }
    });
  }
};

exports.getAllBlogs = (req, res) => {
  const getAllBlogsStmt = DB.prepare(`SELECT * FROM posts LIMIT 10;`);
  const blogs = getAllBlogsStmt.all();
  res.status(200).json(blogs);
};

exports.deleteBlog = (req, res) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({ message: "Token not provided" });
  } else {
    jwt.verify(token, authsecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        req.email = decoded.email;
        let getUserStmt = DB.prepare(`SELECT * FROM users WHERE email=?;`);
        let user = getUserStmt.get(req.email);
        if (user.is_admin === 1) {
          let id = req.params.id;
          let deleteBlogStmt = DB.prepare(`DELETE FROM posts WHERE id =?;`);
          deleteBlogStmt.run(id);
          res.status(200).json({ message: "Blog successfully deleted" });
        } else {
          return res.status(401).json(
            { message: "Not authorized to delete post" },
          );
        }
      }
    });
  }
};
