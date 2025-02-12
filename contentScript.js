// Injected JavaScript
chrome.storage.sync.get('option', (data) => {
  if (data.option) {
    localStorage.setItem('injectedOption', data.option);
    console.log('Injected option:', data.option);
  } else {
    console.log('No option found.');
  }
});