import {
  getFormForUploadingImage,
  postImageToServer,
  getRoboFlowPrediction,
} from '../../src/apis/RoboflowApi';

function runPage() {
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

runPage();
