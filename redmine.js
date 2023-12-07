// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// A generic onclick callback function.
chrome.contextMenus.onClicked.addListener((item, tab) => {
  openRedmine(item.selectionText);
}
);

chrome.runtime.onInstalled.addListener(function () {
chrome.contextMenus.create({
  title: "Add Redmine",
  contexts: ['selection'],
  id: "addredmine"
});
});

chrome.commands.onCommand.addListener(function(command) {
if (command == "addredmine") {
  getCurrentTabId(
    tabId => getSelectedText(tabId,
      text => {
        openRedmine(text);
      }
    )
  )
}
return true;
});

function getCurrentTabId(callback) {
chrome.tabs.query(
  { active: true, currentWindow: true },
  tabs => {
    const tabId = tabs[0].id;
    if (callback) {
      callback(tabId);
    }
  }
);
}

function getSelectedText(tabId, callback) {
chrome.scripting.executeScript(
  {
    target: { tabId, allFrames: false },
    func: injection,
  },
  injectionResults => {
    const text = injectionResults[0].result;
    callback(text);
  }
);
}

function injection() {
const domSelectionText = decodeURI(encodeURI(
  document.selection ? document.selection.createRange().text
    : window.getSelection ? window.getSelection()
      : document.getSelection ? document.getSelection()
        : ""
));
if (domSelectionText) {
  return new Promise(resolve => resolve(domSelectionText));
}
else{
  return "";
}
}

function openRedmine(txt) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var currentTab = tabs[0];
    chrome.storage.sync.get(['urlParam'], function(result) {
      var foundIssue = false;
      var urltarget = result.urlParam + '/projects/havea/issues/new';
      var id = '#issue_description';
      var regex = /#(\d+)/;
      var resultat = txt.match(regex);
      if (resultat) {
        var motifTrouve = resultat[1];
        urltarget = result.urlParam + '/issues/' + motifTrouve + '/edit';
        var id = '#issue_notes';
        txt = "> " + txt.replace(/\n/g, "\n> ");
        foundIssue = true;
      }
      if (foundIssue) {
        chrome.tabs.create({ url: urltarget }, function(newTab) {
          // Injecte du texte dans la nouvelle tab
          chrome.scripting.executeScript({
            target: { tabId: newTab.id },
            function: function(txt, id) {
              document.querySelector(id).value = txt;
            },
            args: [txt, id]
          });
        });
      } else {        
        chrome.storage.sync.set({ 'txtSelect': txt }, function() {
          chrome.windows.create({
            type: 'popup',
            url: 'selectissues.html',
            width: 400,
            height: 300,
            focused: true,
          });
        });
      }
    });
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.closePopup) {
    chrome.windows.getCurrent(function(window) {
      chrome.windows.remove(window.id);
    });
  }
});