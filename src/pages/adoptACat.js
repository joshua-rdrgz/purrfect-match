import { fetchPetfinder } from '../apis/petFinderApi.js';

export const createCatOptionsForm = async (htmlElement) => {
  const { type: catTypes } = await fetchPetfinder(
    'https://api.petfinder.com/v2/types/cat'
  );

  const breeds = await fetchPetfinder(
    'https://api.petfinder.com/v2/types/cat/breeds'
  );

  const formObj = { ...catTypes, ...breeds };

  let formHTML = `
    <fieldset id="field-age">
      <legend class ="ml-3 text-xl font-medium text-white container mx-auto flex  p-5 flex-col flex-row items-center">Age of Cat</legend>
      <input type="checkbox" name="age-of-cat" id="age-of-cat-baby" value="baby">Baby</input>
      <input type="checkbox" name="age-of-cat" id="age-of-cat-young" value="young">Young</input>
      <input type="checkbox" name="age-of-cat" id="age-of-cat-adult" value="adult">Adult</input>
      <input type="checkbox" name="age-of-cat" id="age-of-cat-senior" value="senior">Senior</input>
    </fieldset>
    <fieldset id="field-size">
      <legend class ="ml-3 text-xl font-medium text-white container mx-auto flex  p-5 flex-col flex-row items-center" >Size of Cat</legend>
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

const generateCatSearchParams = (formElements) => {
  const requestOptions = new URLSearchParams();
  requestOptions.append('type', 'cat');

  for (const formElement of formElements) {
    // FIELD SET INPUTS
    if (formElement.type === 'fieldset') {
      const chosenInputs = Array.from(formElement.children)
        .splice(1) // take off legend / label of fieldset
        .filter((inputElement) => inputElement.checked);

      const chosenFieldName = chosenInputs[0]?.id.split('-')[0];
      const chosenValues = chosenInputs.map(
        (chosenInputEl) => chosenInputEl.value
      );

      if (chosenFieldName) {
        requestOptions.append(chosenFieldName, chosenValues.join(',').toLowerCase());
      }
    }

    // SELECT / OPTION INPUTS
    if (formElement.type === 'select-one') {
      const generatedChosenFieldName = formElement.id.split('-').at(-1);
      const chosenValues = formElement.options[formElement.selectedIndex].value;
      let chosenFieldName;

      switch (generatedChosenFieldName) {
        case 'coats':
          chosenFieldName = 'coats';
          break;
        case 'colors':
          chosenFieldName = 'color';
          break;
        case 'genders':
          chosenFieldName = 'gender';
          break;
        case 'breeds':
          chosenFieldName = 'breed';
          break;
        default:
          throw new Error('must be: coats, colors, genders, or breeds.');
      }

      requestOptions.append(chosenFieldName, chosenValues.toLowerCase());
    }
  }
  return requestOptions;
};

export const getAvailableCats = async (formElements) => {
  const searchParams = generateCatSearchParams(formElements);
  console.log(searchParams.toString());
  try {
    const data = await fetchPetfinder('https://api.petfinder.com/v2/animals?' + searchParams);

    console.log(data);
  } catch (error) {
    console.error('💥💥💥ERROR OCCURRED💥💥💥 : ', error);
    return null;
  }
}
