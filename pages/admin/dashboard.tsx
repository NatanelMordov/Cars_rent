import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('username');

    if (role !== 'admin') {
      router.replace('/unauthorized');
    } else {
      setUsername(name || 'Admin');
      setIsAdmin(true);
    }
  }, []);

  if (isAdmin)
  {
    return <h1>Welcome {username}</h1>; // replace with another page content
  }
}
