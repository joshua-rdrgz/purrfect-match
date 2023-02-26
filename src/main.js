import { createCatOptionsForm, getAvailableCats } from './pages/adoptACat';
import { sendSMS } from './apis/twilioAPI.js';

const typesOfCatsFormElement = document.getElementById('catOptions');
const typesofCatsSubmitButton = document.getElementById('catOptionsSubmit');

// ONLY WORKS ON adoptACat.html PAGE!
if (window.location.href.split('/').at(-1) === 'adoptACat.html') {
  const formElements = await createCatOptionsForm(typesOfCatsFormElement);

  typesofCatsSubmitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    await getAvailableCats(formElements);
  });
}



// sendSMS('Testing from main.js').then((res) => console.log(res));
