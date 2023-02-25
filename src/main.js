import { createCatOptionsForm, getUserCatOptions } from './pages/adoptACat';
import { sendSMS } from './apis/twilioAPI.js';

const typesOfCatsFormElement = document.getElementById('catOptions');
const typesofCatsSubmitButton = document.getElementById('catOptionsSubmit');

const formElements = await createCatOptionsForm(typesOfCatsFormElement);

typesofCatsSubmitButton.addEventListener('click', (e) => {
  e.preventDefault();
  getUserCatOptions(formElements);
})

// sendSMS('Testing from main.js').then((res) => console.log(res));
