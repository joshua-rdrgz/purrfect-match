import {
  createCatOptionsForm,
  getAvailableCats,
  displayAvailableCats,
} from './pages/adoptACat';
import {
  getFormForUploadingImage,
  postImageToServer,
  getRoboFlowPrediction,
} from './apis/RoboflowApi';

// ONLY WORKS ON adoptACat.html PAGE!
if (window.location.href.split('/').at(-1) === 'adoptACat.html') {
  const typesOfCatsFormElement = document.getElementById('catOptions');
  const typesofCatsSubmitButton = document.getElementById('catOptionsSubmit');
  const loadingCatsFormElement = document.getElementById('catOptionsLoading');
  const displayAvailableCatsEl = document.getElementById(
    'available-cats-results'
  );
  createCatOptionsForm(typesOfCatsFormElement).then((formElements) => {
    loadingCatsFormElement.remove();

    typesofCatsSubmitButton.addEventListener('click', async (e) => {
      e.preventDefault();
      const loadingEl = document.createElement('div');
      loadingEl.classList.add('text-center');
      loadingEl.textContent = 'Loading....';
      displayAvailableCatsEl.insertAdjacentElement('beforebegin', loadingEl);
      displayAvailableCatsEl.innerHTML = '';
      const availableCatData = await getAvailableCats(formElements);
      displayAvailableCats(availableCatData, displayAvailableCatsEl);
      loadingEl.remove();
    });
  });
}

// ONLY WORKS ON findBreed.html PAGE!
if (window.location.href.split('/').at(-1) === 'findBreed.html') {
  // GET IMAGE FORM ONTO PAGE
  const imageFormSection = document.getElementById('image-submission-form');
  getFormForUploadingImage().then((imageFormHtml) => {
    imageFormSection.insertAdjacentHTML('afterbegin', imageFormHtml);

    // SEND IMAGE TO THE SERVER ON SUBMIT
    const imageForm = document.getElementById('image-to-server-form');
    const imageInput = document.getElementById('image-to-server-input');
    imageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const postImageRes = await postImageToServer(imageInput.files[0]);
      const roboFlowPredictions = await getRoboFlowPrediction(
        postImageRes.imageName
      );
      const titleElement = document.getElementById('catOutputText');
      const subtitleElement = document.createElement('span');
      subtitleElement.classList.add(
        'title-font',
        'sm:text-3xl',
        'text-2xl',
        'mb-3',
        'font-small',
        'text-white'
      );
      subtitleElement.innerHTML = `Your Cat's breed is:`;
      titleElement.insertAdjacentElement('beforebegin', subtitleElement);
      titleElement.innerHTML = roboFlowPredictions.data.top;
      document.getElementById(
        'catPicUnsplash'
      ).innerHTML = `https://source.unsplash.com/720x600/?${roboFlowPredictions.data.top.replace(
        /\s+/g,
        '-'
      )}`;
    });
  });
}
