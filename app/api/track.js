const logStore = []

export default async function handler(req, res) {
    if(req.method !== "POST"){
        return res.status(405).json({message: "Method not allowed"})
    }

    const ip = req.headers["x-forwarded-for"].toString().split(',')[0] || req.socket.remoteAddress || null

    const { event = "unknown" } = req.body || {}

    const logEntry = {
        timestamp: new Date().toISOString(),
        ip, 
        event, 
        userAgent: req.header['user-agent'] || null,
        language: req.header['accept-language'] || null
    }

    logStore.push(logEntry)

    return res.status(200).json({message: "logged"})
}

export function getLogs(){
    console.log(logStore)
    return logStore
}