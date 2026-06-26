import { useState, useEffect } from 'react';

export type HeaderSettings = {
    topBannerText: string;
    phone: string;
    phoneLink: string;
    whatsapp: string;
};

export type FooterSettings = {
    description: string;
    facebookUrl: string;
    instagramUrl: string;
    tiktokUrl: string;
    address: string;
    phone: string;
    email: string;
};

export function useSiteLayout() {
    const [settings, setSettings] = useState<{
        header: HeaderSettings | null;
        footer: FooterSettings | null;
        categories: any[];
        brands: any[];
    }>({ header: null, footer: null, categories: [], brands: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/settings/layout')
            .then((res) => res.json())
            .then((data) => {
                setSettings({
                    header: data.header,
                    footer: data.footer,
                    categories: data.categories || [],
                    brands: data.brands || [],
                });
            })
            .catch((err) => console.error('Error fetching layout settings:', err))
            .finally(() => setLoading(false));
    }, []);

    return { settings, loading };
}
