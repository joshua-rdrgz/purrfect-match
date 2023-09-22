import {
  createCatOptionsForm,
  getAvailableCats,
  displayAvailableCats,
} from '../../src/pages/adoptACat';

function runPage() {
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

runPage();
