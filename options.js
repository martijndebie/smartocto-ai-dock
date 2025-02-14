document.getElementById('saveButton').addEventListener('click', () => {

  const clientIdValue = document.getElementById('smartocto-ai-clientId').value;
  if (clientIdValue != "") {
    chrome.storage.sync.set({ clientId: clientIdValue }, () => {
      console.log('clientId updated');
    });
  }

  const brandIdValue = document.getElementById('smartocto-ai-brandId').value;
  if (brandIdValue != "") {
    chrome.storage.sync.set({ brandId: brandIdValue }, () => {
      console.log('brandId updated');
    });
  }

  const apiTokenValue = document.getElementById('smartocto-ai-apiToken').value;
  if (apiTokenValue != "") {
    chrome.storage.sync.set({ apiToken: apiTokenValue }, () => {
      console.log('apiToken updated');
    });
  }

  const optionValue = document.getElementById('optionInput').value;
  if (optionValue != "") {
    chrome.storage.sync.set({ option: optionValue }, () => {
      console.log('optionValue updated');
    });
  }
});