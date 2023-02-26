import {
  createCatOptionsForm,
  getAvailableCats,
  displayAvailableCats,
} from './pages/adoptACat';
import {
  getFormForUploadingImage,
  postImageToServer,
  getRoboFlowPrediction
} from './apis/RoboflowApi';
import { sendSMS } from './apis/twilioAPI.js';

// ONLY WORKS ON adoptACat.html PAGE!
if (window.location.href.split('/').at(-1) === 'adoptACat.html') {
  const typesOfCatsFormElement = document.getElementById('catOptions');
  const typesofCatsSubmitButton = document.getElementById('catOptionsSubmit');
  const displayAvailableCatsEl = document.getElementById(
    'available-cats-results'
  );
  const formElements = await createCatOptionsForm(typesOfCatsFormElement);

  typesofCatsSubmitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const availableCatData = await getAvailableCats(formElements);
    displayAvailableCats(availableCatData, displayAvailableCatsEl);
  });
}

if (window.location.href.split('/').at(-1) === 'findBreed.html') {
  const imageFormSection = document.getElementById('image-submission-form');
  const imageFormHtml = await getFormForUploadingImage();
  imageFormSection.insertAdjacentHTML('afterbegin', imageFormHtml);

  const imageForm = document.getElementById('image-to-server-form');
  const imageInput = document.getElementById('image-to-server-input');
  imageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await postImageToServer(imageInput.files[0]);
    const roboFlowPredictions = await getRoboFlowPrediction(res.imageName);
    console.log('roboFlowPredictions:', roboFlowPredictions);
    console.log(roboFlowPredictions.data.top)
    console.log(roboFlowPredictions.data.top.replace(/\s+/g, '-'))
    document.getElementById('catOutputText').innerHTML = roboFlowPredictions.data.top
    document.getElementById('catPicUnsplash').innerHTML = `https://source.unsplash.com/720x600/?${roboFlowPredictions.data.top.replace(/\s+/g, '-')}`;
  });
}

// sendSMS('Testing from main.js').then((res) => console.log(res));
