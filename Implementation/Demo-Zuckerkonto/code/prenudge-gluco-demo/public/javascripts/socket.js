const socket = io()

socket.on('connect', () => {
    console.log(socket.connected)
})

socket.on('disconnect', () => {
    console.log(socket.connected)
})

socket.on('connect_error', (error) => {
    console.log('Connection refused:', error)
})

socket.on('sync', () => {
    console.log('asked to sync')
    fetchLatestTransactions()
        .then((transactions) => {
            console.log(transactions)
            return renderTransactions(transactions)
        })
        .catch(error => console.log(error))
})

const fetchLatestTransactions = async () => {
    try {
        const res = await fetch('/api/transactions')
        if (!res.ok) throw new Error('Network response was not ok')
        return await res.json()
    } catch (err) {
        console.error('Failed to load transactions:', err)
    }
}

const renderTransactions = (transactions) => {
    const container = document.getElementById('async-measurement-list')
    if (container) {
        const template = Handlebars.templates.transactions
        container.innerHTML = template({latestMeasurements: transactions})
    }
}

