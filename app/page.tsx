'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      switch (user.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'student':
          router.push('/student');
          break;
        case 'mentor':
          router.push('/mentor');
          break;
        case 'faculty':
          router.push('/faculty');
          break;
        default:
          router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return null;
}
