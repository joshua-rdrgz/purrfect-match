import { fetchPetfinder } from '../apis/petFinderApi.js';

export const createCatOptionsForm = async (htmlElement) => {
  const { type: catTypes } = await fetchPetfinder(
    'https://api.petfinder.com/v2/types/cat'
  );

  const breeds = await fetchPetfinder(
    'https://api.petfinder.com/v2/types/cat/breeds'
  );

  const formObj = { ...catTypes, ...breeds };

  console.log(formObj);

  let formHTML = '';
  const formIds = [];

  for (const pair of Object.entries(formObj)) {
    const [pairKey, pairValues] = pair;
    if (!Array.isArray(pairValues)) continue;

    formIds.push(`selectField-${pairKey}`);

    formHTML += `
      <label for="${pairKey}">${pairKey}</label>
      <select id="selectField-${pairKey}" name="${pairKey}" id="${pairKey}">
        ${pairValues.map((pairValue) => {
          const option = pairValue.name ? pairValue.name : pairValue;
          return `
            <option value="${option}">${option}</option>
          `;
        }).join('')}
      </select>
    `;
  }

  htmlElement.insertAdjacentHTML('afterbegin', formHTML);

  return formIds.map((formId) => document.getElementById(formId)); 
};

export const getUserCatOptions = (formElements) => {
  for (const formElement of formElements) {
    const chosenValue = formElement.options[formElement.selectedIndex].value;
    console.log(chosenValue);
  }
}
