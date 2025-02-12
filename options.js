document.getElementById('saveButton').addEventListener('click', () => {
  const optionValue = document.getElementById('optionInput').value;
  chrome.storage.sync.set({ option: optionValue }, () => {
    alert('Option saved!');
  });
});