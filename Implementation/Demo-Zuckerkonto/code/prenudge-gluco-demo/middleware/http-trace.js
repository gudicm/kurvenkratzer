// middleware/http-trace.js
import fs from 'fs'
import path from 'path'
import onFinished from 'on-finished'

const ENABLE = process.env.TRACE_HTTP === 'true'
const LOG_PATH = process.env.TRACE_HTTP_FILE || process.env.HTTP_TRACE_FILE || path.join(process.cwd(), 'tmp', 'http-traces.jsonl')
const TRUNCATE_LEN = Number(process.env.TRACE_HTTP_TRUNCATE || 1000)

function redactHeaders(h) {
    const out = {}
    for (const [k, v] of Object.entries(h || {})) {
        const lk = k.toLowerCase()
        if (lk === 'authorization' || lk === 'cookie' || lk === 'set-cookie') out[k] = '[REDACTED]'
        else out[k] = v
    }
    return out
}

function truncate(str, len = TRUNCATE_LEN) {
    if (str == null) return str
    const s = typeof str === 'string' ? str : JSON.stringify(str)
    return s.length > len ? s.slice(0, len) + '...[truncated]' : s
}

let fileStream = null
if (ENABLE) {
    try {
        const dir = path.dirname(LOG_PATH)
        fs.mkdirSync(dir, { recursive: true })
        fileStream = fs.createWriteStream(LOG_PATH, { flags: 'a' })
    } catch (err) {
        // fallback: null stream (we'll continue to console.log)
        fileStream = null
    }
}

function writePersistent(obj) {
    try {
        const line = JSON.stringify(obj) + '\n'
        if (fileStream) fileStream.write(line)
    } catch (_) { }
}

function writeBoth(obj) {
    const out = JSON.stringify(obj)
    // keep console output for quick debugging
    console.log(out)
    // also persist (best-effort)
    writePersistent(obj)
}

// no-op middleware when disabled
function noopTrace(req, res, next) { next() }

let traceMiddleware = noopTrace

if (ENABLE) {
    // patch global.fetch for outgoing traces
    const originalFetch = globalThis.fetch || (await import('node-fetch')).default

    globalThis.fetch = async function (input, init = {}) {
        const method = (init && init.method) || (typeof input === 'string' ? 'GET' : (input.method || 'GET'))
        const url = typeof input === 'string' ? input : (input.url || '<Request>')
        const reqHeaders = init.headers || (typeof input !== 'string' ? input.headers : {})
        const reqBody = init.body || (typeof input !== 'string' && input.body ? '<stream>' : undefined)
        const start = Date.now()
        try {
            const resp = await originalFetch(input, init)
            let text = '<unreadable>'
            try {
                const clone = resp.clone()
                text = await clone.text().catch(() => '<non-text>')
            } catch (_) { }
            const duration = Date.now() - start
            const msg = {
                direction: 'outgoing',
                timestamp: new Date().toISOString(),
                method,
                url,
                headers: redactHeaders(reqHeaders),
                requestBody: truncate(reqBody),
                status: resp.status,
                statusText: resp.statusText,
                responseBody: truncate(text),
                durationMs: duration
            }
            writeBoth(msg)
            return resp
        } catch (err) {
            writeBoth({
                direction: 'outgoing',
                timestamp: new Date().toISOString(),
                method,
                url,
                headers: redactHeaders(reqHeaders),
                requestBody: truncate(reqBody),
                error: String(err),
                durationMs: Date.now() - start
            })
            throw err
        }
    }

    // incoming middleware
    function httpTraceMiddleware(req, res, next) {
        const start = Date.now()
        const reqBody = req.body !== undefined ? req.body : '<stream/none>'

        // capture response body by wrapping write/end
        const chunks = []
        const origWrite = res.write
        const origEnd = res.end

        res.write = function (chunk, ...args) {
            try { if (chunk) chunks.push(Buffer.from(chunk)) } catch (_) { }
            return origWrite.call(this, chunk, ...args)
        }
        res.end = function (chunk, ...args) {
            try { if (chunk) chunks.push(Buffer.from(chunk)) } catch (_) { }
            return origEnd.call(this, chunk, ...args)
        }

        onFinished(res, function () {
            const duration = Date.now() - start
            let resBody = ''
            try { resBody = Buffer.concat(chunks).toString('utf8') } catch (_) { resBody = '<binary>' }

            const msg = {
                direction: 'incoming',
                timestamp: new Date().toISOString(),
                method: req.method,
                url: req.originalUrl || req.url,
                headers: redactHeaders(req.headers),
                requestBody: truncate(reqBody),
                status: res.statusCode,
                responseBody: truncate(resBody),
                durationMs: duration
            }
            writeBoth(msg)
        })
        next()
    }

    traceMiddleware = httpTraceMiddleware
}

export default traceMiddleware
