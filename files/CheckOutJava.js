// --- JAVASCRIPT FOR CHECKOUT PAGE ---

document.addEventListener('DOMContentLoaded', () => {
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

       
        alert('Payment Successful! Your booking is confirmed.\n\nThank you for choosing us.');
        paymentForm.reset();
    });
});

