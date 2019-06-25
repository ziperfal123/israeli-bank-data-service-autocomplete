const https = require("https");
const xml2js = require("xml2js");
const parser = new xml2js.Parser({ attrkey: "ATTR" });

exports.fetchAll = (req, res) => {
  global.allData = [];
  global.bankDataForAutocomplete = [];
  const url =
    "https://www.boi.org.il/he/BankingSupervision/BanksAndBranchLocations/Lists/BoiBankBranchesDocs/snifim_dnld_he.xml";
  https.get(url, result => {
    let data = "";
    result.on("data", stream => {
      data += stream;
    });
    result.on("end", () => {
      parser.parseString(data, (error, result) => {
        if (!error) {
          global.allData = result.BRANCHES.BRANCH;
          global.allData.map(objectToParse => {
            let currentBankName = objectToParse.Bank_Name[0];
            let lastItemIndex = global.bankDataForAutocomplete.length - 1;

            if (lastItemIndex >= 0) {
              if (
                currentBankName ===
                global.bankDataForAutocomplete[lastItemIndex].bankName
              ) {
                global.bankDataForAutocomplete[
                  lastItemIndex
                ].branchesArray.push(objectToParse.Branch_Code[0]);
              } else {
                // create a new bank object
                global.bankDataForAutocomplete.push({
                  bankName: currentBankName,
                  branchesArray: [objectToParse.Branch_Code[0]]
                });
              }
            } else {
              global.bankDataForAutocomplete.push({
                bankName: currentBankName,
                branchesArray: [objectToParse.Branch_Code[0]]
              });
            }
          });

          res.send("dataFatched");
        } else {
          res.send({
            internalStatusCode: -1,
            statusMessage: "Bank API Problem"
          });
        }
      });
    });
  });
};

exports.getBankNames = (req, res) => {
  const userInput = req.query.userInput;
  let regex;
  try {
    regex = RegExp(`^${userInput}`);
  } catch (err) {
    res.json("");
  }

  let arrOfMatchedDataToDisplay = [];
  if (global.bankDataForAutocomplete) {
    global.bankDataForAutocomplete.map(objToTest => {
      if (regex.test(objToTest.bankName))
        arrOfMatchedDataToDisplay.push(objToTest.bankName);
    });
  }
  res.json(arrOfMatchedDataToDisplay);
};

exports.getBranchesNumbers = (req, res) => {
  let bankNameFromUser = req.query.bankNameFromUser;
  let userInput = req.query.userInput;
  userInput = userInput.trim();
  bankNameFromUser = bankNameFromUser.trim();

  let regex;
  try {
    regex = RegExp(`^${userInput}`);
  } catch (err) {
    res.json("");
  }
  let chosenBankObject;
  let arrOfBranches;
  let matchingBranchesArr;
  if (global.bankDataForAutocomplete && bankNameFromUser) {
    chosenBankObject = global.bankDataForAutocomplete.find(elem => {
      if (elem.bankName === bankNameFromUser) return elem;
    });
    if (chosenBankObject) {
      arrOfBranches = chosenBankObject.branchesArray;
      matchingBranchesArr = [];
      arrOfBranches.map(stringToCheck => {
        if (regex.test(stringToCheck)) {
          matchingBranchesArr.push(stringToCheck);
        }
      });
    }

    res.json(matchingBranchesArr);
  } else {
    res.json("ERROR");
  }
};

exports.getAllDataAboutBank = (req, res) => {
  let bankNameToFind = req.query.bankName;
  let branchNumberToFind = req.query.branchNumber;
  bankNameToFind = bankNameToFind.replace("/", "");
  bankNameToFind = bankNameToFind.replace(`\\`, "");
  bankNameToFind = bankNameToFind.trim();
  branchNumberToFind = branchNumberToFind.trim();
  let chosenBankObject;
  if (global.allData) {
    chosenBankObject = global.allData.find(elemToCheck => {
      if (elemToCheck.Bank_Name[0] === bankNameToFind)
        if (elemToCheck.Branch_Code[0] === branchNumberToFind)
          return elemToCheck;
    });
  }

  if (!chosenBankObject) {
    res.json({
      internalStatusCode: -1,
      statusMessage: "bank not found"
    });
  } else {
    res.send(chosenBankObject);
  }
};
