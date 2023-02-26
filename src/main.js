import { createCatOptionsForm, getAvailableCats } from './pages/adoptACat';
import { sendSMS } from './apis/twilioAPI.js';

// ONLY WORKS ON adoptACat.html PAGE!
if (window.location.href.split('/').at(-1) === 'adoptACat.html') {
  const typesOfCatsFormElement = document.getElementById('catOptions');
  const typesofCatsSubmitButton = document.getElementById('catOptionsSubmit');
  const formElements = await createCatOptionsForm(typesOfCatsFormElement);

  typesofCatsSubmitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    await getAvailableCats(formElements);
  });
}
console.log('testing');

if (window.location.href.split('/').at(-1) === 'findBreed.html') {
  const submitButton = document.getElementById('imageButtonSubmit');
  console.log(submitButton);

  submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('hello from main.js');
  });
}

// sendSMS('Testing from main.js').then((res) => console.log(res));
