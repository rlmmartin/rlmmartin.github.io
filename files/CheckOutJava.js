document.addEventListener('DOMContentLoaded', () => {

    // --- References to Order Summary Elements ---
    const summaryService = document.getElementById('summaryService');
    const summaryDateTime = document.getElementById('summaryDateTime');
    const summaryTotal = document.getElementById('summaryTotal');

    /*
     * Retrieves booking data from localStorage and populates the Order Summary section.
     */
    function populateOrderSummary() {
        const mainService = localStorage.getItem('booking_main_service');
        const subServicesJson = localStorage.getItem('booking_sub_services');
        const date = localStorage.getItem('booking_date');
        const time = localStorage.getItem('booking_time');
        const price = localStorage.getItem('booking_date_price'); // Price from calendar (Day Rate)

        // 1. Validate if booking data exists
        if (!mainService || !date || !time || !price) {
            // This happens if the user navigates directly to Checkout without booking first
            summaryService.textContent = 'No booking found. Please book a service first.';
            summaryDateTime.textContent = '';
            summaryTotal.textContent = '$0.00';
            
           
            // alert('Your booking session has expired or no services were selected. Redirecting to bookings page.');
           
            return;
        }

        // 2. Format Service Details
        let serviceDetails = mainService;
        if (subServicesJson) {
            try {
                const subServices = JSON.parse(subServicesJson);
                if (subServices.length > 0) {
                    serviceDetails += ` (${subServices.join(', ')})`;
                }
            } catch (e) {
                console.error("Error parsing sub-services JSON:", e);
            }
        }

        // 3. Format Date and Time
        // The date from localStorage is a full string (e.g., "Tue Dec 16 2025"). We need to clean it up.
        // We'll format it to something like: "December 16, 2025 at 1:00 PM"
        let formattedDate = '';
        try {
            // Date string parsing is complex, but the toDateString format is usually robust
            const dateObj = new Date(date);
            formattedDate = dateObj.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (e) {
             formattedDate = date; // Fallback to raw string
        }
        const formattedDateTime = `${formattedDate} at ${time}`;


        // 4. Update the DOM elements
        summaryService.textContent = serviceDetails;
        summaryDateTime.textContent = formattedDateTime;
        summaryTotal.textContent = `$${parseFloat(price).toFixed(2)}`;
        
        console.log('Order Summary populated successfully.');
    }

    // Call the function to populate the summary immediately on load
    populateOrderSummary();
    


    // --- PAYMENT FORM LOGIC (Card formatting and Validation) ---



    const paymentForm = document.getElementById('paymentForm');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCVCInput = document.getElementById('cardCVC');

    // Helper to format the card number with spaces every 4 digits
    cardNumberInput.addEventListener('input', function(e) {
        let input = e.target.value.replace(/\D/g, ''); // Remove non-digits
        input = input.substring(0, 16); // Limit to 16 digits
        // Insert a space after every 4 digits
        e.target.value = input.replace(/(\d{4})/g, '$1 ').trim();
    });

    // Helper to format the expiration date as MM/YY
    cardExpiryInput.addEventListener('input', function(e) {
        let input = e.target.value.replace(/\D/g, ''); // Remove non-digits
        
        // Add a slash after the second digit for the month
        if (input.length > 2) {
            input = input.substring(0, 2) + '/' + input.substring(2);
        }
        
        // Limit to 5 characters (MM/YY)
        e.target.value = input.substring(0, 5);
    });
    
    // Helper to limit CVC to 3 or 4 digits
    cardCVCInput.addEventListener('input', function(e) {
        let input = e.target.value.replace(/\D/g, ''); // Remove non-digits
        e.target.value = input.substring(0, 4); // Limit to 4 characters
    });


    // --- Form Submission and Validation ---
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop the form from submitting normally

        const cardNumber = cardNumberInput.value.replace(/\s/g, ''); // Remove spaces
        const cardExpiry = cardExpiryInput.value;
        const cardCVC = cardCVCInput.value;
        const cardName = document.getElementById('cardName').value;
        const termsChecked = document.getElementById('terms').checked;
        
        // Basic Client-Side Validation 
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            alert('Please enter a valid card number (13-19 digits).');
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            alert('Please enter a valid expiration date in MM/YY format.');
            return;
        }

        if (cardCVC.length < 3) {
            alert('Please enter a 3 or 4 digit CVC/CVV.');
            return;
        }
        
        if (cardName.trim() === "") {
            alert('Please enter the name on the card.');
            return;
        }
        
        if (!termsChecked) {
            alert('You must agree to the Terms and Conditions.');
            return;
        }

        // If validation passes:
        
        // ** Step 1: Clear the Booking Data (Optional but recommended for single-use booking) **
        localStorage.removeItem('booking_main_service');
        localStorage.removeItem('booking_sub_services');
        localStorage.removeItem('booking_date');
        localStorage.removeItem('booking_time');
        localStorage.removeItem('booking_date_price');


        // ** Step 2: Confirmation Alert and Reset **
        alert('Payment Successful! Your booking is confirmed.\n\nThank you for choosing us.');
        paymentForm.reset();
        
        // ** Step 3: Redirect or Update Summary **
        // Since booking data is cleared, we re-run the summary function to show 'No booking found'.
        populateOrderSummary(); 


    });
});
