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

  let formHTML = `
    <fieldset id="field-age">
      <legend>Age of Cat</legend>
      <input type="checkbox" name="age-of-cat" id="age-of-cat-baby" value="baby">Baby</input>
      <input type="checkbox" name="age-of-cat" id="age-of-cat-young" value="young">Young</input>
      <input type="checkbox" name="age-of-cat" id="age-of-cat-adult" value="adult">Adult</input>
      <input type="checkbox" name="age-of-cat" id="age-of-cat-senior" value="senior">Senior</input>
    </fieldset>
    <fieldset id="field-size">
      <legend>Size of Cat</legend>
      <input type="checkbox" name="size-of-cat" id="size-of-cat-small" value="small">Small</input>
      <input type="checkbox" name="size-of-cat" id="size-of-cat-medium" value="medium">Medium</input>
      <input type="checkbox" name="size-of-cat" id="size-of-cat-large" value="large">Large</input>
      <input type="checkbox" name="size-of-cat" id="size-of-cat-xlarge" value="xlarge">X-Large</input>
    </fieldset>
  `;
  const formIds = ['field-age', 'field-size'];

  for (const pair of Object.entries(formObj)) {
    const [pairKey, pairValues] = pair;
    if (!Array.isArray(pairValues)) continue;

    formIds.push(`selectField-${pairKey}`);

    formHTML += `
      <label for="${pairKey}">${pairKey}</label>
      <select id="selectField-${pairKey}" name="${pairKey}" id="${pairKey}">
        ${pairValues
          .map((pairValue) => {
            const option = pairValue.name ? pairValue.name : pairValue;
            return `
            <option value="${option}">${option}</option>
          `;
          })
          .join('')}
      </select>
    `;
  }

  htmlElement.insertAdjacentHTML('afterbegin', formHTML);

  return formIds.map((formId) => document.getElementById(formId));
};

// OPTIONS FOR FINDING CATS
// - type: cat
// - breed: (accounted for)
// - gender: (accounted for)
// - color: (accounted for)
// - coats: (accounted for)
// - status: defaults to adoptable (accounted for)
// - size: small, medium, large, xlarge (accepts multiple values) -- NOT accounted for
// - age: baby, young, adult, senior (accepts multiple values) -- NOT accounted for
// - location: city, state; latitude,longitude; or postal code. -- NOT accounted for
// - distance: max is 500 miles -- NOT accounted for

// - sort, - page, - limit -- set up after everything else
export const getUserCatOptions = (formElements) => {
  for (const formElement of formElements) {
    if (formElement.type === 'fieldset') {
      const chosenValues = Array.from(formElement.children)
        .splice(1) // take off legend / label of fieldset
        .filter((inputElement) => inputElement.checked)
        .map((chosenInputEl) => chosenInputEl.value);
      console.log(chosenValues);
    }

    if (formElement.type === 'select-one') {
      const chosenValue = formElement.options[formElement.selectedIndex].value;
      console.log(chosenValue);
    }
  }
};
