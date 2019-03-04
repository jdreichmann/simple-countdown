(function(window) {

    function fetchEvents() {
        const events = [
            {name: "EH19", date: "2019-04-19T10:00:00.000+01:00", description: "Wien c:"}
        ];
        return new Promise((fullfill, reject) => {
            fullfill(events)
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
        const title = document.createElement('h4')
        title.textContent = event.name
        title.style.cssFloat = 'left'
        const date = document.createElement('h4')
        date.textContent = event.date
        date.style.cssFloat = 'right'/1
        const eventUnix = Date.parse(event.date)
        const countdown = document.createElement('h1')
        countdown.textContent = eventUnix - Date.now()
        countdown.style.clear = 'both'
        setInterval(() => {
            const diff = eventUnix - Date.now()
            countdown.textContent = millisecondsToHumanReadable(diff)
        }, 200)
        container.appendChild(title)
        container.appendChild(date)
        container.appendChild(countdown)
        window.document.body.appendChild(container)
    }

    window.onload = () => {
        fetchEvents().then(events => {
            events.forEach(event => renderEvent(event))
        })
    }

})(window);