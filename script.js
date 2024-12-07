const scriptURL = 'https://script.google.com/macros/s/AKfycbwCQ_YUauwHvwXVANMgY-hC2RKIdB1x7G0q0vKyT9dEySlFcPSd4VDw4M7iwViUe_egow/exec';
const form = document.forms['submit-to-google-sheet'];
const Msg = document.getElementById("Msg");

// Function to check if the email already exists
async function isDuplicateEmail(email) {
  try {
    const response = await fetch(`${scriptURL}?emailCheck=${email}`, { method: 'GET' });
    const data = await response.json();
    return data.exists; // Returns true if email exists
  } catch (error) {
    console.error('Error checking email:', error);
    return false; // Default to no duplicates if error occurs
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  
  const emailInput = form.querySelector('input[name="email"]'); // Find the email input field
  const email = emailInput ? emailInput.value.trim() : null;

  if (!email || !validateEmail(email)) {
    Msg.innerHTML = "Please enter a valid email.";
    setTimeout(() => Msg.innerHTML = "", 3000);
    return;
  }

  Msg.innerHTML = "Checking for duplicates...";

  const isDuplicate = await isDuplicateEmail(email);

  if (isDuplicate) {
    Msg.innerHTML = "This email has already been submitted.";
    setTimeout(() => Msg.innerHTML = "", 3000);
  } else {
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .then(response => {
        Msg.innerHTML = "Your email has been submitted.";
        setTimeout(() => Msg.innerHTML = "", 3000);
        form.reset();
      })
      .catch(error => {
        Msg.innerHTML = "Error submitting form.";
        console.error('Error!', error.message);
      });
  }
});

// Email validation function
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
