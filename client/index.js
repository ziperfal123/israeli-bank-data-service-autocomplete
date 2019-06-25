const submitBtn = document.getElementById("submit-btn");
const textFieldBankName = document.getElementById("text-field-bank-name");
const textFieldBranchNumber = document.getElementById(
  "text-field-branch-number"
);
const chosenBankData = document.getElementById("chosen-bank-data");
const formContainer = document.getElementById("form-container");
const banksAutoCompleteSection_UL = document.getElementById(
  "banks-autocomplete-section"
);
const branchesNumbersAutoComplete_UL = document.getElementById(
  "branches-numbers-autocomplete-section"
);
const nameResultOptionsToChoose = document.getElementsByClassName(
  "name-result-item"
);
const branchResultOptionsToChoose = document.getElementsByClassName(
  "branch-result-item"
);

let userInput = "";
let userSelectedBankName = "";

let userSelectedBranchNumber = "";

const url_getAllData = `http://localhost:3000/`;
const url_getBanksNames = `http://localhost:3000/getBankNames`;
const url_getBranchesNumbers = `http://localhost:3000/getBranchesNumbers`;
const url_getBankInfo = `http://localhost:3000/getAllDataAboutBank`;

window.xRequest_getAllData = new XMLHttpRequest();
window.xRequest_bankNames = new XMLHttpRequest(); // declering our xRequests at the global scope so new request will abort an old one..
window.xRequest_branchesNumbers = new XMLHttpRequest();
window.xRequest_getBankInfo = new XMLHttpRequest();
window.onload = onLoadFunc();
textFieldBankName.focus();

textFieldBankName.onkeyup = function(value) {
  userSelectedBankName = textFieldBankName.value;
  if (
    value.which >= 65 ||
    value.which === 32 ||
    value.which === 8 ||
    (value.which >= 48 && value.which <= 57)
  ) {
    if (value.which !== 91 && value.which !== 93 && value.which !== 219)
      handleValidKeyPress_banksNames(value.which);
  } else if (value.which === 13) handleEnterKeyPress("nameField");
};

textFieldBranchNumber.onkeyup = function(value) {
  userSelectedBranchNumber = textFieldBranchNumber.value;
  if (
    value.which >= 65 ||
    value.which === 32 ||
    value.which === 8 ||
    (value.which >= 48 && value.which <= 57)
  ) {
    if (value.which !== 91 && value.which !== 93 && value.which !== 219)
      handleValidKeyPress_branchesNumbers(value.which);
  } else if (value.which === 13) handleEnterKeyPress("branchField");
};

submitBtn.onclick = function(e) {
  e.preventDefault();
  let bankName = userSelectedBankName;
  let branchNumber = userSelectedBranchNumber;
  xRequest_getBankInfo.onreadystatechange = () => {
    if (xRequest_getBankInfo.readyState === 4) {
      if (xRequest_getBankInfo.status === 200) {
        generateDataDiv(xRequest_getBankInfo.responseText);
      }
      if (xRequest_getBankInfo.status === 404) {
        let notFoundDiv = document.createElement("div");
        notFoundDiv.innerHTML = generateNotFoundDivText();
        if (formContainer.querySelectorAll("#not-found-div").length === 0)
          formContainer.appendChild(notFoundDiv);
      }
    }
  };

  xRequest_getBankInfo.open(
    "get",
    `${url_getBankInfo}?bankName=${bankName}&branchNumber=${branchNumber}`,
    true
  );
  xRequest_getBankInfo.send();
};

function handleEnterKeyPress(whichField) {
  let chosenResult;
  if (whichField === "nameField") {
    if (nameResultOptionsToChoose.length === 1) {
      chosenResult = nameResultOptionsToChoose[0].innerHTML;
      userSelectedBankName = chosenResult;
      textFieldBankName.value = chosenResult;
      banksAutoCompleteSection_UL.innerHTML = "";
      if (textFieldBankName.value !== "") textFieldBranchNumber.focus();
      else alert("please choose a valid bank");
    }
  } else if (whichField === "branchField") {
    if (branchResultOptionsToChoose.length === 1) {
      chosenResult = branchResultOptionsToChoose[0].innerHTML;
      userSelectedBranchNumber = chosenResult;
      textFieldBranchNumber.value = chosenResult;
      branchesNumbersAutoComplete_UL.innerHTML = "";
      branchResultOptionsToChoose.innerHTML = "";
    }
    submitBtn.click();
  }
}

banksAutoCompleteSection_UL.addEventListener("click", e => {
  if (e.target && e.target.matches("li.name-result-item")) {
    textFieldBranchNumber.focus();
    let listItemValue = e.target.innerHTML;
    listItemValue = listItemValue.replace(`\\`, "");
    textFieldBankName.value = `${listItemValue}`;
    userSelectedBankName = listItemValue;
    banksAutoCompleteSection_UL.innerHTML = "";
  }
});

branchesNumbersAutoComplete_UL.addEventListener("click", e => {
  if (e.target && e.target.matches("li.branch-result-item")) {
    let listItemValue = e.target.innerHTML;
    listItemValue = listItemValue.replace(`\\`, "");
    textFieldBranchNumber.value = listItemValue;
    userSelectedBranchNumber = listItemValue;
    branchesNumbersAutoComplete_UL.innerHTML = "";
    textFieldBranchNumber.focus();
  }
});

function handleValidKeyPress_banksNames(keyCode) {
  if (keyCode === 8) chosenBankData.id = "chosen-bank-data-hidden";
  banksAutoCompleteSection_UL.innerHTML = "";
  xRequest_bankNames.onreadystatechange = () => {
    if (xRequest_bankNames.readyState === 4) {
      if (xRequest_bankNames.status === 200) {
      }
      if (xRequest_bankNames.status === 404) {
        let notFoundDiv = document.createElement("div");
        notFoundDiv.innerHTML = generateNotFoundDivText();
        if (formContainer.querySelectorAll("#not-found-div").length === 0)
          formContainer.appendChild(notFoundDiv);
      }
      banksAutoCompleteSection_UL.innerHTML = "";
      displayMatchedResults_banksNames(
        xRequest_bankNames.responseText.split(",")
      );
    }
  };

  if (userSelectedBankName.length > 0) {
    xRequest_bankNames.open(
      "get",
      `${url_getBanksNames}?userInput=${userSelectedBankName}`,
      true
    );
    xRequest_bankNames.send();
  } else banksAutoCompleteSection_UL.innerHTML = "";
}

function handleValidKeyPress_branchesNumbers(keyCode) {
  if (keyCode === 8) chosenBankData.id = "chosen-bank-data-hidden";
  branchesNumbersAutoComplete_UL.innerHTML = "";
  xRequest_branchesNumbers.onreadystatechange = () => {
    if (xRequest_branchesNumbers.readyState === 4) {
      if (xRequest_branchesNumbers.status === 200) {
        branchesNumbersAutoComplete_UL.innerHTML = "";
        displayMatchedResults_branchesNumbers(
          xRequest_branchesNumbers.responseText.split(",")
        );
      }
      if (xRequest_branchesNumbers.status === 404) {
        let notFoundDiv = document.createElement("div");
        notFoundDiv.innerHTML = generateNotFoundDivText();
        if (formContainer.querySelectorAll("#not-found-div").length === 0)
          formContainer.appendChild(notFoundDiv);
      }
    }
  };
  if (userSelectedBranchNumber.length > 0) {
    let bankName = userSelectedBankName;
    let userInput = userSelectedBranchNumber;
    xRequest_branchesNumbers.open(
      "get",
      `${url_getBranchesNumbers}?userInput=${userInput}&bankNameFromUser=${bankName}`,
      true
    );
    xRequest_branchesNumbers.send();
  } else branchesNumbersAutoComplete_UL.innerHTML = "";
}
function displayMatchedResults_banksNames(matchedResults) {
  let i = 0;
  matchedResults = [...new Set(matchedResults)];
  if (matchedResults.length === 0) banksAutoCompleteSection_UL.innerHTML = "";
  else {
    branchesNumbersAutoComplete_UL.innerHTML = "";
    chosenBankData.id = "chosen-bank-data-hidden";
    matchedResults.map(() => {
      matchedResults[i] = matchedResults[i].replace(`"`, "");
      matchedResults[i] = matchedResults[i].replace("[", "");
      matchedResults[i] = matchedResults[i].replace("]", "");
      matchedResults[i] = matchedResults[i].slice(0, -1);
      matchedResults[i] = matchedResults[i].replace("/", "");
      matchedResults[i] = matchedResults[i].replace(`\\`, "");

      banksAutoCompleteSection_UL.innerHTML += `<li class="name-result-item">${
        matchedResults[i++]
      }</li>`;
    });
  }
}

function displayMatchedResults_branchesNumbers(matchedResults) {
  let i = 0;
  if (matchedResults.length > 0) {
    chosenBankData.id = "chosen-bank-data-hidden";
    matchedResults.map(() => {
      matchedResults[i] = matchedResults[i].replace(`"`, "");
      matchedResults[i] = matchedResults[i].replace("[", "");
      matchedResults[i] = matchedResults[i].replace("]", "");
      matchedResults[i] = matchedResults[i].slice(0, -1);
      matchedResults[i] = matchedResults[i].replace("/", "");
      matchedResults[i] = matchedResults[i].replace(`\\`, "");

      if (
        banksAutoCompleteSection_UL.getElementsByClassName("name-result-item")
          .length === 0
      )
        branchesNumbersAutoComplete_UL.innerHTML += `<li class="branch-result-item">${
          matchedResults[i++]
        }</li>`;
    });
  } else if (matchedResults.length === 0)
    branchesNumbersAutoComplete_UL.innerHTML = "";
}

function generateDataDiv(data) {
  let bankInfoJsonObj = JSON.parse(data);
  if (bankInfoJsonObj.internalStatusCode === -1) {
    textFieldBankName.value = "";
    textFieldBranchNumber.value = "";
    alert(`${bankInfoJsonObj.statusMessage}..`);
    branchesNumbersAutoComplete_UL.innerHTML = "";
    banksAutoCompleteSection_UL.innerHTML = "";
    chosenBankData.innerHTML = "";
    textFieldBankName.focus();
    return;
  }
  const bankName = bankInfoJsonObj.Bank_Name[0] || "-";
  const branchCode = bankInfoJsonObj.Branch_Code[0] || "-";
  const branchAddress = bankInfoJsonObj.Branch_Address[0] || "-";
  const zipCode = bankInfoJsonObj.Zip_Code[0] || "-";
  const poBox = bankInfoJsonObj.POB[0] || "-";
  const telephoneNumber = bankInfoJsonObj.Telephone[0] || "-";
  const faxNumber = bankInfoJsonObj.Fax[0] || "-";
  const tollFreeNumber = bankInfoJsonObj.Free_Tel[0] || "-";
  const handicapAccess = bankInfoJsonObj.Handicap_Access[0] || "-";
  const dayClosed = bankInfoJsonObj.day_closed[0] || "-";

  chosenBankData.id = "chosen-bank-data";
  chosenBankData.innerHTML = `
    <p align=left><span>Bank Name: &nbsp</span> ${bankName}</p>
    <p align=left><span>Branch code:  &nbsp</span> ${branchCode}</p>
    <p align=left><span>Branch Address:  &nbsp</span> ${branchAddress}</p>
    <p align=left><span>Zip Code:  &nbsp</span> ${zipCode}</p>
    <p align=left><span>PO Box:  &nbsp</span> ${poBox}</p>
    <p align=left><span>Telephone Number:  &nbsp</span> ${telephoneNumber}</p>
    <p align=left><span>Fax Number:  &nbsp</span> ${faxNumber}</p>
    <p align=left><span>Toll Free Number:  &nbsp</span> ${tollFreeNumber}</p>
    <p align=left><span>Handicap Access  &nbsp</span> ${handicapAccess}</p>
    <p align=left><span>Day Closed:  &nbsp</span> ${dayClosed}</p>
    `;
}

function generateNotFoundDivText() {
  let notFoundDivText = `
  <div id="not-found-div">
    <h1>4 0 4</h1>
    <h1>invalid route, page not found..</h1>
    <h2>Please try to refresh the page..</h2>
  </div>
  `;
  return notFoundDivText;
}

function onLoadFunc() {
  xRequest_branchesNumbers.open("get", `${url_getAllData}`, false);
  xRequest_branchesNumbers.send();
}
