(function(window) {

    window.events = {
        showPastEvents: false
    }

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

    function renderEventTitle(event) {
        const title = document.createElement('p')
        title.textContent = event.name
        title.classList += 'title'
        return title
    }

    function renderEventDate(event) {
        const date = document.createElement('p')
        date.textContent = event.date
        date.classList += 'date'
        return date
    }

    function renderEventDescription(event) {
        const desc = document.createElement('p')
        desc.textContent = event.description
        desc.classList += 'description'
        return desc
    }

    function renderEventCountdown(event) {
        const eventUnix = Date.parse(event.date)
        const countdown = document.createElement('p')
        countdown.classList += 'countdown'
        countdown.textContent = eventUnix - Date.now()
        setInterval(() => {
            const diff = eventUnix - Date.now()
            countdown.textContent = millisecondsToHumanReadable(diff)
        }, 200)
        return countdown
    }

    function renderEvent(event) {
        const container = document.createElement('div')
        container.classList += 'event_container'
        container.appendChild(renderEventTitle(event))
        container.appendChild(renderEventDate(event))
        container.appendChild(renderEventDescription(event))
        container.appendChild(renderEventCountdown(event))
        window.document.body.appendChild(container)
    }

    window.onload = () => {
        fetchEvents().then(events => {
            const now = Date.now()
            events
                .filter(event => !(window.events.showPastEvents && (Date.parse(event.date) - now < 0)))
                .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
                .forEach(event => renderEvent(event))
        })
    }

})(window);

//window.events.showPastEvents = true