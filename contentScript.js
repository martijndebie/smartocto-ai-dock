// Injected JavaScript

chrome.storage.sync.get('option', (data) => {
  if (data.option) {
    localStorage.setItem('injectedOption', data.option);
    console.log('Injected option:', data.option);

    let styleSheetData = "div#smartocto-ai-form h1 {padding: 0px 10px 0 10px; margin-top: 0px;} div#smartocto-ai-headlines h1 {padding: 24px 10px 0 10px; margin: 0;} p#smartocto-ai-instruction {margin:0; padding:0;} div#smartocto-ai-form { padding: 13px 10px 0 10px;} div#smartocto-ai-form button { width: 70%; } div#smartocto-ai-form * {width:100%; } div#smartocto-ai-form textarea {height: 200px; overflow: auto; } div#smartocto-ai-status { padding: 13px 10px 0 10px;} *[data-smartocto-ai-hover='active'] {background-color: #e42b58e3 !important; } ul.ai__suggestions-list { align-items: center; list-style: none; cursor: default; margin:0 !important; padding: 0 !important; } #smartocto-ai-timestamp {padding: 5px; color: #ffe3e3; font-size: 7pt !important;} #smartocto-ai-headlines p {font-size: 14pt !important; padding:5px;} #smartocto-ai-results { overflow: auto;height:100%; position: fixed; top:0px; right:0; z-index: 999999999; width:310px; background-color:#760E2E; padding:0px 0px; border-radius:0px; color:white !important; z-index: 99999999;} #smartocto-ai-results h1 { color: white; } ul.ai__suggestions-list li { font-size: 12pt !important; align-items: center; border-bottom: 1px solid #E63656; display: flex; flex-direction: row; justify-content: space-between;padding: 15px;list-style: none;} #smartocto-ai-optionbox { height: 45px;background-color: #A72242;flex-direction: row;padding: 13px 10px 0 10px;align-items: flex-start;border-bottom: 2px solid #760E2E;} #smartocto-ai-optionbox h3 { color: #fff;font: normal 15px / 18px 'Verdana' !important;margin-top: 6px;width: 90px;float: left; } #smartocto-ai-header-bar { height:45px;background-color:white } #smartocto-ai-header-bar #smartocto-ai-logo {width: 20px;float: left;margin-top: 10px;margin-left: 10px; } .smartocto-ai-selected-option { background-color: #fff;font: normal 15px / 18px Verdana !important;padding: 5px 10px;border-radius: 25px;color: #760E2E;text-align: center;cursor: default;text-transform: lowercase;max-width: 150px;float: left; margin-left: 10px; width: 100%;} hr {margin-top:2px; margin-bottom:2px;}";
    if (document.getElementById('smartocto-ai-style') == null) {
      var smartoctoAiStyle = document.createElement('style');
      smartoctoAiStyle.id = "smartocto-ai-style";
      document.head.appendChild(smartoctoAiStyle);
      smartoctoAiStyle.innerHTML = styleSheetData;
    }

    function updateInstruction(instruction) {
      if (instruction == "hide") {
        document.getElementById("smartocto-ai-instruction").style.display = "none";
      }
      else {
        document.getElementById("smartocto-ai-instruction").textContent = instruction;
      }
    }

    // Functie om de resultaten weer te geven in een lijst
    function displayResults(data) {
      const resultsList = document.getElementById("results");
      resultsList.innerHTML = ""; // Leeg de lijst eerst

      if (Array.isArray(data)) {
        data.forEach(item => {
          const listItem = document.createElement("li");
          listItem.textContent = JSON.stringify(item); // Of toon specifieke data
          resultsList.appendChild(listItem);
        });
      } else {
        const listItem = document.createElement("li");
        listItem.textContent = "Geen resultaten gevonden.";
        resultsList.appendChild(listItem);
      }
    }

    function updateDisplayedOption(selectedActionType){
      document.getElementsByClassName('smartocto-ai-selected-option')[0].innerText = selectedActionType;
    }

    // Functie om de geselecteerde tekst te kopiëren naar het input-field
    function copyToInput() {
      console.log("Function copyToInput triggered!");
      const selectedText = window.getSelection().toString();
      if (selectedText !== null && selectedText !== "" && selectedText !== undefined) {
        document.getElementById("ai-selected-headline").value = selectedText;
        //updateInstruction("Select body of the story");
      }
      else {
        alert("No text selected, try again");
      }
    }

    // Functie om de geselecteerde tekst te plakken in het textarea-field
    function pasteToTextarea() {
      const selectedText = window.getSelection().toString();
      if (selectedText !== null && selectedText !== "" && selectedText !== undefined) {
        document.getElementById("ai-selected-bodytext").value = selectedText;
        //updateInstruction("hide");
      }
      else {
        alert("No text selected, try again");
      }
    }

    // Functie om de data naar de API te sturen
    async function sendToAPI(selectedActionType) {
      let inputText = document.getElementById("ai-selected-headline").value;
      let textareaText = document.getElementById("ai-selected-bodytext").value;
      if (textareaText == "") { alert("The headline or bodytext is not selected. Try again"); return; }

      if (inputText == "") {  inputText = " "; }

      if (selectedActionType == 'headlines') {
        document.getElementById('smartocto-ai-headlines').innerHTML = "";
        document.getElementById('smartocto-ai-headlines').style.display = "none";

        try {
          const myHeaders = new Headers();
          myHeaders.append("accept", "application/json");
          myHeaders.append("Content-Type", "application/json");

          const nowForApi = Date.now();
          var result = [];
          result.brandId = 'denboschnieuws';
          result.clientId = 'dbn';
          result.apiToken = 'rwjbv0rozt2k0s8ivh1ca';

          const raw = JSON.stringify({
            "request_id": nowForApi.toString(),
            "client": result.clientId,
            "text": inputText + "||" + textareaText,
            "type": "pageviews"
          });

          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          };

          document.getElementById('smartocto-ai-status').innerHTML = "<p>One moment please, smartocto.ai generates headlines...</p>";
          document.getElementById('smartocto-ai-status').style.display = "block";

          document.getElementById('smartocto-ai-results').style.display = "block";
          updateDisplayedOption('content');

          var apiUrl = "https://api.smartocto.com/api/integrations/v2/" + result.brandId + "/ai/headliner?api_key=" + result.apiToken;


          const response = await fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(data => {
              /* console.log(data); */

              let headlineContent = '<h1>Suggestions</h1><ul class="ai__suggestions-list">';
              for (let key in data.alternatives) {
                headlineContent += `<li>${data.alternatives[key]}</li>`;
              }
              headlineContent += `</ul>`;

              let timestampGenerated = new Date();
              document.getElementById('smartocto-ai-status').innerHTML = "";
              document.getElementById('smartocto-ai-status').style.display = "none";
              document.getElementById('smartocto-ai-headlines').innerHTML = headlineContent;
              document.getElementById('smartocto-ai-headlines').style.display = "block";

              document.getElementById('smartocto-ai-timestamp').innerHTML = "Generated: " + timestampGenerated;

              return;
            });

          // const data = await response.json();
          // displayResults(data);
        } catch (error) {
          console.error('Error:', error);
        }
      }

      if (selectedActionType == 'paragraphs') {
        alert('soon available!');
      }
    }

    function compileDock(optimiseOption) {
      if (document.getElementById('smartocto-ai-results')) {
        console.log('AI service is already loaded');
        return;
      }
      else {
        // compile content for div
        let tempContent = '';
        tempContent += '<div id="smartocto-ai-header-bar"><div id="smartocto-ai-logo"><svg width="47" height="28" viewBox="0 0 47 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-miterlimit:10"><path d="M12.551,2.44c-6.338,-0 -11.482,5.131 -11.496,11.472c-0.013,6.349 5.123,11.506 11.472,11.52l20.983,0.045l0.024,0c6.338,0 11.483,-5.131 11.496,-11.471c0.013,-6.349 -5.123,-11.507 -11.472,-11.52l-20.983,-0.046c-0.008,-0 -0.016,-0 -0.024,-0" style="fill:#fefdff;fill-rule:nonzero"></path><path d="M24.318,14.029c0,6.355 -5.151,11.506 -11.506,11.506c-6.354,-0 -11.506,-5.151 -11.506,-11.506c0,-6.354 5.152,-11.506 11.506,-11.506c6.355,0 11.506,5.152 11.506,11.506" style="fill:#e52553;fill-rule:nonzero"></path><path d="M31.222,17.584l0,-6.177l-2.253,-0l0,-2.465l2.253,-0l0,-3.977l2.465,0l0,3.977l3.182,-0l-0,2.465l-3.182,-0l0,5.832c0,1.776 0.372,2.624 1.962,2.624l1.272,0l0,2.466l-1.882,-0c-2.703,-0 -3.817,-1.512 -3.817,-4.745" style="fill:#fff;fill-rule:nonzero"></path><path d="M12.551,2.44c-6.338,-0 -11.482,5.131 -11.496,11.472c-0.013,6.349 5.123,11.506 11.472,11.52l20.983,0.045l0.024,0c6.338,0 11.483,-5.131 11.496,-11.471c0.013,-6.349 -5.123,-11.507 -11.472,-11.52l-20.983,-0.046c-0.008,-0 -0.016,-0 -0.024,-0Z" style="fill:none;fill-rule:nonzero;stroke:#e52553;stroke-width:.8px"></path><path d="M9.709,18.662c0.929,-0 1.687,-0.317 2.274,-0.949c0.587,-0.632 0.881,-1.445 0.881,-2.439c0,-0.981 -0.294,-1.787 -0.881,-2.42c-0.587,-0.632 -1.345,-0.948 -2.274,-0.948c-0.929,-0 -1.684,0.316 -2.265,0.948c-0.581,0.633 -0.871,1.439 -0.871,2.42c-0,0.994 0.29,1.807 0.871,2.439c0.581,0.632 1.336,0.949 2.265,0.949m3.155,-6.776l0,-1.49l1.8,-0l0,9.775l-1.8,0l0,-1.49c-0.103,0.193 -0.248,0.397 -0.435,0.61c-0.188,0.213 -0.417,0.403 -0.688,0.571c-0.271,0.168 -0.59,0.309 -0.958,0.426c-0.368,0.116 -0.791,0.174 -1.268,0.174c-0.658,-0 -1.277,-0.133 -1.858,-0.397c-0.581,-0.264 -1.084,-0.629 -1.51,-1.094c-0.426,-0.464 -0.762,-1.013 -1.007,-1.645c-0.245,-0.632 -0.367,-1.316 -0.367,-2.052c-0,-0.723 0.122,-1.4 0.367,-2.033c0.245,-0.632 0.581,-1.18 1.007,-1.645c0.426,-0.465 0.929,-0.829 1.51,-1.094c0.581,-0.264 1.2,-0.397 1.858,-0.397c0.477,0 0.9,0.058 1.268,0.175c0.368,0.116 0.687,0.261 0.958,0.435c0.271,0.174 0.5,0.365 0.688,0.571c0.187,0.207 0.332,0.407 0.435,0.6" style="fill:#fff;fill-rule:nonzero"></path><path d="M16.89,10.396l1.801,-0l-0,9.775l-1.801,0l0,-9.775Zm-0.329,-2.691c0,-0.348 0.119,-0.639 0.358,-0.871c0.239,-0.232 0.526,-0.348 0.862,-0.348c0.335,-0 0.622,0.116 0.861,0.348c0.239,0.232 0.358,0.523 0.358,0.871c0,0.349 -0.119,0.639 -0.358,0.871c-0.239,0.232 -0.526,0.349 -0.861,0.349c-0.336,-0 -0.623,-0.117 -0.862,-0.349c-0.239,-0.232 -0.358,-0.522 -0.358,-0.871" style="fill:#fff;fill-rule:nonzero"></path></svg></div><div id="close-smartocto-ai-suggestions" style="position:relative;right: 0px;top: 0px;width: 16px; vertical-align: middle; float: right;font-size: 30px;height: 16px;color: #a1a1a1 !important;!i;!;margin-right: 20px;font-family: verdana,arial;"><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13.524 1L8 6.524 2.476 1 1 2.476 6.523 8 1 13.524 2.476 15l5.523-5.524L13.524 15 15 13.524 9.476 8 15 2.476z" fill-rule="evenodd"></path></svg></div></div>';
        tempContent += '<div id="smartocto-ai-optionbox"><h3>Optimise:</h3><div class="smartocto-ai-selected-option" data-role="optimise-selected">' + optimiseOption + '</div></div><div id="smartocto-ai-status" style="display:none"></div>';

        tempContent += `<div id="smartocto-ai-form"><h1>Text selection</h1><p id="smartocto-ai-instruction"></p>
      <input type="text" id="ai-selected-headline" readonly><br />
      <button id="ai-input-headline">Copy selected headline</button> <button id="ai-clear-input-headline">Clear</button><br><br />
      <textarea id="ai-selected-bodytext"></textarea><br />
      <button id="ai-input-body">Copy selected bodytext</button> <button id="ai-clear-input-body">Clear</button><br><br />
      <button id="ai-generate-headlines">Generate headlines</button>
      <button id="ai-generate-paragraphs">Generate paragraphs</button></div>
      `;

        //Create div with headlines
        tempContent += `<div id="smartocto-ai-headlines"></div>`;

        // Update timestamp in the dock
        let timestampGenerated = new Date();
        tempContent += `<div id="smartocto-ai-timestamp">generated: ` + timestampGenerated.toString() + `</div>`;

        //create div which holds the html
        const smartocto_results_div = document.createElement('div');
        smartocto_results_div.id = "smartocto-ai-results";
        smartocto_results_div.innerHTML = tempContent;
        document.body.appendChild(smartocto_results_div);

        document.getElementById('close-smartocto-ai-suggestions').addEventListener('click', function () {
          //remove the dock fromt the page
          document.getElementById('smartocto-ai-results').remove();
        });


        document.getElementById('ai-input-headline').addEventListener('click', function (e) {
          console.log('click on button: ai-input-headline');
          copyToInput();
        });

        document.getElementById('ai-input-body').addEventListener('click', function (e) {
          console.log('click on button: ai-input-body');
          pasteToTextarea();
        });

        document.getElementById('ai-generate-headlines').addEventListener('click', function (e) {
          console.log('click on button: ai-generate-headlines');
          sendToAPI('headlines');
        });

        document.getElementById('ai-generate-paragraphs').addEventListener('click', function (e) {
          console.log('click on button: ai-generate-paragraphs');
          sendToAPI('paragraphs');
        });

        document.getElementById('ai-analyse-userneeds').addEventListener('click', function (e) {
          console.log('click on button: ai-analyse-userneeds');
          sendToAPI('userneeds');
        });

        document.getElementById('ai-clear-input-body').addEventListener('click', function (e) {
          document.getElementById('ai-selected-bodytext').value="";
        });

        document.getElementById('ai-clear-input-headline').addEventListener('click', function (e) {
          document.getElementById('ai-selected-headline').value="";
        });

        //updateInstruction("Select the headline of the story");
      }
    }

    compileDock('content');


  } else {
    console.log('No option found.');
  }
});