document.addEventListener('DOMContentLoaded', function() {
    var newIssue = document.getElementById('newIssue');

    
    chrome.storage.sync.get(['urlParam'], function(result) {
        targetURL = result.urlParam || '';
        console.log(targetURL);
        targetURL = targetURL + '/issues?per_page=100&sort=due_date%2Cid%3Adesc';
        console.log(targetURL);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', targetURL, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const container = document.createElement('div');
                    container.innerHTML = xhr.responseText;
                    const subjectTDs = container.querySelectorAll('td.subject');
                    subjectTDs.forEach(td => {
                        console.log(td.textContent);
                    });
                } else {
                    console.error('Erreur HTTP! Statut :', xhr.status);
                }
            }
        };
        xhr.send();
    })


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