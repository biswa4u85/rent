import { useState, useEffect } from 'react';
import SiteApis from "./SiteApis";
import { useSession } from "next-auth/react";

export function useFetch(params: any) {
    const session: any = useSession()
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response: any = await SiteApis.getDataApi(params.url, params.query ? JSON.parse(params.query) : {}, session?.data?.user?.token);
            if (!response?.error) {
                setData(response);
            }
            setLoading(false);
        };
        fetchData();
    }, [params.query]);

    return { data, loading };
}