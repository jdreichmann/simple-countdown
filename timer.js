(function(window) {

    function fetchEvents() {
        return new Promise((fullfill, reject) => {
            fetch('./events.json')
                .then(answer => answer.json())
                .then(events => fullfill(events))
                .catch(err => reject(err))
        })
    }

    const dateMeasures = {
        day : (60 * 60 * 24),
        hour : (60 * 60),
        minute : 60
    }

    function millisecondsToHumanReadable(mseconds) {
        const seconds = mseconds / 1000
        const days = Math.floor(seconds / dateMeasures.day)
        const hours = Math.floor((seconds - days * dateMeasures.day) / dateMeasures.hour)
        const minutes = Math.floor((seconds - days * dateMeasures.day - hours * dateMeasures.hour) / dateMeasures.minute)
        const secondsLeft = (seconds - days * dateMeasures.day - hours * dateMeasures.hour - minutes * dateMeasures.minute).toFixed(2)
        return `${days} days, ${hours < 10 ? '0' + hours: hours}:${minutes < 10 ? '0' + minutes : minutes}:${secondsLeft < 10 ? '0' + secondsLeft : secondsLeft} left`
    }

    function renderEvent(event) {
        const container = document.createElement('div')
        container.classList += 'event_container'
        const title = document.createElement('h4')
        title.textContent = event.name
        title.style.cssFloat = 'left'
        const date = document.createElement('h4')
        date.textContent = event.date
        date.style.cssFloat = 'right'
        const desc = document.createElement('p')
        desc.textContent = event.description
        desc.style.clear = 'both'
        const eventUnix = Date.parse(event.date)
        const countdown = document.createElement('h1')
        countdown.textContent = eventUnix - Date.now()
        setInterval(() => {
            const diff = eventUnix - Date.now()
            countdown.textContent = millisecondsToHumanReadable(diff)
        }, 200)
        container.appendChild(title)
        container.appendChild(date)
        container.appendChild(desc)
        container.appendChild(countdown)
        window.document.body.appendChild(container)
    }

    window.onload = () => {
        fetchEvents().then(events => {
            events
                .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
                .forEach(event => renderEvent(event))
        })
    }

})(window);