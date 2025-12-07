//* ------------- JAVASCRIPT FOR BOOKINGS PAGE ----------------------- *//

document.addEventListener('DOMContentLoaded', () => {
    
    
    let currentDate = new Date();
    const calendarGrid = document.getElementById('calendarGrid');
    const monthYearDisplay = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    
    const WEEKEND_PRICE = 20; 
    const WEEKDAY_PRICE = 30; 
    let selectedDateCell = null;
    
    const confirmDateButton = document.getElementById('confirmDateButton'); 
    const confirmTimeButton = document.getElementById('confirmTimeButton'); 

  /* to do some time conversion */
    function formatTime(hour24) {
        if (hour24 === 12) {
            return "12:00 PM";
        } else if (hour24 === 0) {
            return "12:00 AM"; 
        } else if (hour24 > 12) {
            return `${hour24 - 12}:00 PM`;
        } else {
            return `${hour24}:00 AM`;
        }
    }

    
    /* Here is responsable for the rendering of the calendar grid for the current month and year. */
    function renderCalendar() {
        calendarGrid.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); 
        monthYearDisplay.textContent = currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });

        const firstDayOfMonth = new Date(year, month, 1).getDay(); 
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            
            if (date <= today) {
                const cell = document.createElement('div');
                cell.classList.add('date-cell', 'past-date');
                cell.innerHTML = `<span class="date-num">${day}</span>`;
                calendarGrid.appendChild(cell);
                continue; 
            }
            
            let price;
            let priceClass;
            if (dayOfWeek === 0 || dayOfWeek === 6) { 
                price = WEEKEND_PRICE;
                priceClass = 'weekend-price';
            } else { 
                price = WEEKDAY_PRICE;
                priceClass = 'weekday-price';
            }

            const cell = document.createElement('div');
            cell.classList.add('date-cell');
            cell.setAttribute('data-date', date.toDateString());
            
            cell.innerHTML = `
                <span class="date-num">${day}</span>
                <span class="price-tag ${priceClass}">$${price}</span>
            `;

            cell.addEventListener('click', function() {
                if (selectedDateCell) {
                    selectedDateCell.classList.remove('selected');
                }
                this.classList.add('selected');
                selectedDateCell = this;
                console.log('Selected Date:', this.getAttribute('data-date'));
            });

            calendarGrid.appendChild(cell);
        }
    }

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    renderCalendar();

    //*------------ STEP 3: with the logic for the timer slide------------------*//
    const timeSlider = document.getElementById('timeSlider');
    const selectedTimeDisplay = document.getElementById('selectedTimeDisplay');

    timeSlider.addEventListener('input', function() {
        const selectedHour24 = parseInt(this.value);
        selectedTimeDisplay.textContent = formatTime(selectedHour24);
        console.log('Selected Time:', selectedTimeDisplay.textContent);
    });

    //* ---Everything under here is for the BUTTON LOGIC --- *//

    //* Simple confirmation for Step 1 *//
    document.querySelector('.the-first-confirm-button').addEventListener('click', () => {
        alert('Step 1 Confirmed! Please proceed with date and time selection below.');
    });

    //* Step 2 confirmation *//
    confirmDateButton.addEventListener('click', () => {
        if (!selectedDateCell) {
            alert('Please select a Date before confirming Step 2.');
            return;
        }
        alert(`Step 2 Confirmed! Date: ${selectedDateCell.getAttribute('data-date')}. Now, please confirm your time slot in Step 3.`);
    });
    
    //* Final Step 3 confirmation *//
    confirmTimeButton.addEventListener('click', () => {
        if (!selectedDateCell) {
            alert('Please confirm a Date in Step 2 before finalizing the booking time.');
            return;
        }
        
        const finalTime = selectedTimeDisplay.textContent;
        const finalDate = selectedDateCell.getAttribute('data-date');
        
        alert(`BOOKING COMPLETE!!!!!!!! \nService Date: ${finalDate}\nTime Slot: ${finalTime}\nProceeding to Checkout...`);
        
    });
});

