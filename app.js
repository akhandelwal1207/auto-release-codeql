const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 🛑 Hardcoded secret (Credential exposure)
const SECRET_KEY = "my-super-secret-key-123";

// 🛑 Insecure random (predictable values)
const insecureToken = Math.random().toString(36).substring(2);

// 🛑 Weak hashing (MD5 collision issues)
const weakHash = crypto.createHash('md5').update('password123').digest('hex');

// Route: File Read (Path Traversal vulnerability)
app.get('/readfile', (req, res) => {
  const filename = req.query.file;
  // ⚠️ Path traversal possible (e.g., ?file=../../etc/passwd)
  const filePath = path.join(__dirname, filename);
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('File error');
    res.send(`<pre>${data}</pre>`);
  });
});

// Route: Command Injection vulnerability
app.get('/exec', (req, res) => {
  const userCommand = req.query.cmd;
  // ⚠️ Dangerous: passes user input directly into shell
  const { exec } = require('child_process');
  exec(userCommand, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send('Execution error');
    }
    res.send(`<pre>${stdout}</pre>`);
  });
});

// Route: Open Redirect vulnerability
app.get('/redirect', (req, res) => {
  const target = req.query.url;
  // ⚠️ Unvalidated redirect
  res.redirect(target);
});

// Route: Insecure cookie
app.get('/setcookie', (req, res) => {
  // ⚠️ No HttpOnly or Secure flags
  res.cookie('sessionId', '12345', { maxAge: 900000 });
  res.send('Insecure cookie set');
});
