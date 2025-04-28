import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { username, password } = req.body;

  // load users.json
  const filePath = path.join(process.cwd(), 'data', 'users.json');
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const users = JSON.parse(fileData);

  // looking for the logged-in user and validate the password
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.status(200).json({ username: user.username, role: user.role });
}