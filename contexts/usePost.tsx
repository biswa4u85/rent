import { useState } from 'react';
import SiteApis from "./SiteApis";
import { useSession } from "next-auth/react";

export function usePost() {
    const session: any = useSession()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const create = async (url: any, body: any) => {
        try {
            setLoading(true);
            const response: any = await SiteApis.addDataApi(url, body,session?.data?.user?.token);
            if (!response?.error) {
                setData(response);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
    return { create, data, loading };
}