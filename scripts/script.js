function getSpecificDayOfMonth(year, month, dayOfWeek, weekIndex, time) {
    let date = new Date(year, month, 1);
    let count = 0;
    let day = -1;

    while (date.getMonth() === month) {
        if (date.getDay() === dayOfWeek) {
            count++;
            if (count === weekIndex) {
                day = date.getDate();
                break;
            }
        }
        date.setDate(date.getDate() + 1);
    }

    if (day !== -1) {
        const eventDate = new Date(year, month, day);
        const dayOfWeekTexts = ['日', '月', '火', '水', '木', '金', '土'];
        const dayOfWeekText = dayOfWeekTexts[dayOfWeek];

        return {
            date: eventDate,
            dayOfWeekText: dayOfWeekText,
            time: time,
            dateString: `${eventDate.getFullYear()}/${String(eventDate.getMonth() + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}`,
            displayString: `${String(eventDate.getMonth() + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}${dayOfWeekText} ${time}～`
        };
    }
    return null;
}

function generateCalendarData(yearsToLookAhead = 1) {
    const today = new Date();
    const eventList = [];
    const currentYear = today.getFullYear();
    const endYear = currentYear + yearsToLookAhead;

    for (let year = currentYear; year <= endYear; year++) {
        for (let month = 0; month < 12; month++) {
            const secondFriday = getSpecificDayOfMonth(year, month, 5, 2, "22:00");
            if (secondFriday) {
                const eventDateWithTime = new Date(secondFriday.date);
                eventDateWithTime.setHours(22, 0, 0, 0);

                if (eventDateWithTime > today) {
                    eventList.push(secondFriday);
                }
            }

            const fourthSaturday = getSpecificDayOfMonth(year, month, 6, 4, "21:00");
            if (fourthSaturday) {
                const eventDateWithTime = new Date(fourthSaturday.date);
                eventDateWithTime.setHours(21, 0, 0, 0);

                if (eventDateWithTime > today) {
                    eventList.push(fourthSaturday);
                }
            }
        }
    }

    eventList.sort((a, b) => a.date - b.date);

    return eventList;
}

document.addEventListener('DOMContentLoaded', () => {
    const futureEvents = generateCalendarData(1);
    const container = document.getElementById('calendar-container');

    if (!container) {
        console.error('ID "calendar-container" が見つかりません。HTML側に設置してください。');
        return;
    }

    container.innerHTML = '';

    if (futureEvents.length === 0) {
        container.innerHTML = '<p>現在のところ、予定されている開催日はありません。</p>';
        return;
    }

    const nextEvent = futureEvents[0];
    const otherEvents = futureEvents.slice(1);

    const nextEventHTML = `
        <div class="calendar-section">
            <h3 class="section-title">直近の開催予定</h3>
            <div class="event-item highlight-event">
                <span class="date">${String(nextEvent.date.getMonth() + 1).padStart(2, '0')}/${String(nextEvent.date.getDate()).padStart(2, '0')} ${nextEvent.dayOfWeekText}</span>
                <span class="time">${nextEvent.time}～</span>
            </div>
        </div>
    `;

    let otherEventsHTML = `<div class="calendar-section other-events-section">`;
    let currentYear = null;

    otherEvents.forEach(event => {
        const year = event.date.getFullYear();

        if (year !== currentYear) {
            if (currentYear !== null) {
                otherEventsHTML += '</div>';
            }
            currentYear = year;
            otherEventsHTML += `<h3 class="section-title event-year">${year}年</h3><div class="year-events-list">`;
        }

        otherEventsHTML += `
            <div class="event-item">
                <span class="date">${String(event.date.getMonth() + 1).padStart(2, '0')}/${String(event.date.getDate()).padStart(2, '0')}${event.dayOfWeekText}</span>
                <span class="time">${event.time}～</span>
            </div>
        `;
    });

    if (otherEvents.length > 0) {
        otherEventsHTML += '</div></div>';
    } else {
        otherEventsHTML = '';
    }

    container.innerHTML = nextEventHTML + otherEventsHTML;
});