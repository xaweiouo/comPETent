import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const Home = () => {
    const [rows, setRows] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            try {
                const { data, error } = await supabase.from('sitter_service_with_rating').select('*')

                if (error) throw error
                setRows(data)
            } catch (err) {
                setError(err?.message ?? String(err))
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div>
            <h1>Supabase_【sitter_service_with_rating 資料讀取測試】</h1>
            {loading && <p>載入中...</p>}
            {error && <pre style={{ color: 'red' }}>{error}</pre>}
            {rows && <pre id="output">{JSON.stringify(rows, null, 2)}</pre>}
        </div>
    )
}
        
export default Home