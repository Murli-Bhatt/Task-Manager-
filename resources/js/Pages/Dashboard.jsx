import { useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Dashboard() {
    useEffect(() => {
        // Redirect directly to tasks page
        router.visit('/tasks');
    }, []);

    return null;
}
