document.addEventListener('DOMContentLoaded', function() {
    var newIssue = document.getElementById('newIssue');
  
    // Enregistrer la nouvelle valeur du paramètre URL
    newIssue.addEventListener('click', function() {        
        chrome.storage.sync.get(['txtSelect'], function(result) {
            txt = result.txtSelect || '';
            chrome.storage.sync.get(['urlParam'], function(result) {    
                var urltarget = result.urlParam + '/projects/havea/issues/new';
                var id = '#issue_description';
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
            });
            chrome.runtime.sendMessage({ closePopup: true });
        });
    });
});