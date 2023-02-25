import { getPetfinderApi } from './apis/petFinderApi.js';
import { sendSMS } from './apis/twilioAPI.js';

const petFinderButton = document.getElementById('petFinderButton');

const fetchPetfinder = async () => {
  return await getPetfinderApi('https://api.petfinder.com/v2/animals');
};

petFinderButton.addEventListener('click', async () => {
  const data = await fetchPetfinder();
  console.log(data);
});

// sendSMS('Testing from main.js').then((res) => console.log(res));
