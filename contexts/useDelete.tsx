import { useState } from 'react';
import SiteApis from "./SiteApis";
import { useSession } from "next-auth/react";

export function useDelete() {
    const session: any = useSession()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const remove = async (url: any, body: any) => {
        try {
            setLoading(true);
            const response: any = await SiteApis.deleteDataApi(url, body,session?.data?.user?.token);
            if (!response?.error) {
                setData(response);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
    return { remove, data, loading };
}