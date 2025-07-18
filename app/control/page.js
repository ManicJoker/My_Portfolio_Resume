import { getLogs } from '../api/tracker/route'

export default function ControlPanel () {
    const logs = getLogs()
    
    return (
        <div className="p-8 font-mono bg-black text-white min-h-screen">
            <h1 className="text-3xl mb-6">Page Logs</h1>
            <table className="w-full border border-gray-700 text-sm">
                <thead>
                    <tr className='bg-gray-800'>
                        <th className="p-2 border border-gray-700">Timestamp</th>
                        <th className="p-2 border border-gray-700">IP</th>
                        <th className="p-2 border border-gray-700">Event</th>
                        <th className="p-2 border border-gray-700">User Agent</th>
                        <th className="p-2 border border-gray-700">Language</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        logs.map((itm, idx )=> (
                            <tr key={idx} className="border-t border-gray-700 hover:bg-gray-800">  
                                <td className="p-2">{itm.timestamp}</td>
                                <td className="p-2">{itm.ip}</td>
                                <td className="p-2">{itm.event}</td>
                                <td className="p-2">{itm.userAgent}</td>
                                <td className="p-2">{itm.languge}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}