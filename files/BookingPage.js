//* ------------- JAVASCRIPT FOR BOOKINGS PAGE ----------------------- *//

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STEP 1: Service Selection Variables ---
    const serviceOptions = document.querySelectorAll('.the-service-option');
    const confirmServiceButton = document.getElementById('confirmServiceButton');
    let selectedMainService = null;
    let selectedSubServices = [];


    // --- STEP 2: Calendar Variables ---
    let currentDate = new Date();
    const calendarGrid = document.getElementById('calendarGrid');
    const monthYearDisplay = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    
    // NOTE: Prices defined here are for display only.
    const WEEKEND_PRICE = 20; 
    const WEEKDAY_PRICE = 30; 
    let selectedDateCell = null;
    let selectedDatePrice = null; 

    const confirmDateButton = document.getElementById('confirmDateButton'); 
    const confirmTimeButton = document.getElementById('confirmTimeButton'); 

    // --- STEP 3: Time Slider Variables ---
    const timeSlider = document.getElementById('timeSlider');
    const selectedTimeDisplay = document.getElementById('selectedTimeDisplay');


    // ------------------------------------ LOGIC FUNCTIONS ------------------------------------

    /* Converts 24-hour time values to a readable 12-hour format */
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

    /* Renders the calendar grid for the current month and year. */
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
        
        // This clears the previous selection when month changes
        selectedDateCell = null; 

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            
            // Check if the date is today or in the past
            if (date <= today) {
                const cell = document.createElement('div');
                cell.classList.add('date-cell', 'past-date');
                cell.innerHTML = `<span class="date-num">${day}</span>`;
                calendarGrid.appendChild(cell);
                continue; 
            }
            
            let price;
            let priceClass;
            // dayOfWeek 0 = Sunday, 6 = Saturday (Weekend)
            if (dayOfWeek === 0 || dayOfWeek === 6) { 
                price = WEEKEND_PRICE;
                priceClass = 'weekend-price';
            } else { // Weekday
                price = WEEKDAY_PRICE;
                priceClass = 'weekday-price';
            }

            const cell = document.createElement('div');
            cell.classList.add('date-cell');
            cell.setAttribute('data-date', date.toDateString());
            cell.setAttribute('data-price', price); // Store price on the cell
            
            cell.innerHTML = `
                <span class="date-num">${day}</span>
                <span class="price-tag ${priceClass}">$${price}</span>
            `;

            // Event listener for date selection
            cell.addEventListener('click', function() {
                if (selectedDateCell) {
                    selectedDateCell.classList.remove('selected');
                }
                this.classList.add('selected');
                selectedDateCell = this;
                selectedDatePrice = parseFloat(this.getAttribute('data-price'));
                console.log('Selected Date:', this.getAttribute('data-date'), 'Price:', selectedDatePrice);
            });

            calendarGrid.appendChild(cell);
        }
    }

    // ------------------------------------ EVENT LISTENERS ------------------------------------
    
    //*------------ STEP 1: Service Selection Logic (Saves to localStorage) ------------*//
    serviceOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            // Prevent selection when clicking directly on a checkbox input
            if (e.target.tagName === 'INPUT' || e.target.closest('label')) {
                return;
            }

            // Removes 'selected' class from all other options
            serviceOptions.forEach(opt => {
                opt.classList.remove('selected');
            });

            // Add 'selected' class to the clicked option
            this.classList.add('selected');
            selectedMainService = this.id;
            
            // Clear previous sub-services when main service changes
            document.querySelectorAll('.option-dropdown input[type="checkbox"]').forEach(cb => cb.checked = false);
            selectedSubServices = [];
            
            console.log('Selected Main Service:', selectedMainService);
        });
    });


    //* Confirmation for Step 1: Validate, Store data, and show Alert *//
    confirmServiceButton.addEventListener('click', () => {
        if (!selectedMainService) {
            alert('Please select a main service option first.');
            return;
        }

        // Get the specific sub-services selected by the user
        const checkboxes = document.querySelectorAll(`#${selectedMainService} input[type="checkbox"]:checked`);
        selectedSubServices = Array.from(checkboxes).map(cb => cb.getAttribute('data-sub-service'));

        if (selectedSubServices.length === 0) {
             alert('Please select at least one sub-service before confirming Step 1.');
             return;
        }

        const details = selectedSubServices.join(' & ');

        // --- Save Service Data to localStorage ---
        localStorage.setItem('booking_main_service', selectedMainService); 
        localStorage.setItem('booking_sub_services', JSON.stringify(selectedSubServices));
        
        // Required Alert Confirmation
        alert(`Step 1 Confirmed!
Service: ${selectedMainService}
Details: ${details}

Please proceed to Step 2.`);
    });


    //*------------ STEP 2: Calendar Navigation and Date Selection ------------*//

    prevMonthBtn.addEventListener('click', () => {
        const today = new Date();
        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        
        if (newDate >= currentMonthStart) {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        } else {
            alert('Cannot view past months.');
        }
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    renderCalendar(); // Initial call to render the calendar

    //* Step 2 confirmation *//
    confirmDateButton.addEventListener('click', () => {
        if (!localStorage.getItem('booking_main_service')) {
            alert('Please confirm your service selection in Step 1 first.');
            return;
        }
        if (!selectedDateCell) {
            alert('Please select a Date before confirming Step 2.');
            return;
        }

        // --- Save Date Data to localStorage ---
        localStorage.setItem('booking_date', selectedDateCell.getAttribute('data-date'));
        localStorage.setItem('booking_date_price', selectedDatePrice);

        alert(`Step 2 Confirmed! Date: ${selectedDateCell.getAttribute('data-date')}. Now, please confirm your time slot in Step 3.`);
    });

    //*------------ STEP 3: Time Slider Logic ------------*//
    
    // Initial display of the time
    selectedTimeDisplay.textContent = formatTime(parseInt(timeSlider.value));

    timeSlider.addEventListener('input', function() {
        const selectedHour24 = parseInt(this.value);
        selectedTimeDisplay.textContent = formatTime(selectedHour24);
        console.log('Selected Time:', selectedTimeDisplay.textContent);
    });

    //* Final Step 3 confirmation (Saves to localStorage and finishes booking) *//
    confirmTimeButton.addEventListener('click', () => {
        // Final validation check for all steps
        if (!localStorage.getItem('booking_main_service')) {
            alert('Please confirm your service selection in Step 1.');
            return;
        }
        if (!localStorage.getItem('booking_date')) { 
            alert('Please confirm a Date in Step 2.');
            return;
        }
        
        const finalTime = selectedTimeDisplay.textContent;
        const finalDate = localStorage.getItem('booking_date');
        const finalMainService = localStorage.getItem('booking_main_service');
        const finalServiceDetails = JSON.parse(localStorage.getItem('booking_sub_services')).join(' & ');
        
        // --- Save Time Data to localStorage ---
        localStorage.setItem('booking_time', finalTime);

        
        alert(`BOOKING DATA SAVED! (Ready for Checkout)
Service Type: ${finalMainService}
Details: ${finalServiceDetails}
Service Date: ${finalDate}
Time Slot: ${finalTime}

You can now proceed to the Checkout page.`);
         
    });
});

