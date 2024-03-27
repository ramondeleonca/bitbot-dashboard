import { useState } from "react";

export default function useFetch<T>(url: string) {
    const [data, setData] = useState<T>();
    const [loading, setLoading] = useState(true);
    const reload = () => {
        setLoading(true);
        fetch(url)
            .then(response => response.json())
            .then(setData)
            .then(() => setLoading(false));
    }
    return { data, loading, reload };
}