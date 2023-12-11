document.addEventListener('DOMContentLoaded', function() {
    var newIssue = document.getElementById('newIssue');

    
    chrome.storage.sync.get(['urlParam'], function(result) {
        targetURL = result.urlParam || '';
        targetURL = targetURL + '/issues?per_page=100&sort=due_date%2Cid%3Adesc';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', targetURL, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const container = document.createElement('div');
                    container.innerHTML = xhr.responseText;
                    const subjectTDs = container.querySelectorAll('td.subject a');
                    subjectTDs.forEach(td => {
                        console.log(td.textContent, td.getAttribute("href").split('/').pop());
                        var li = document.createElement('li');
                        var newContent = document.createTextNode(td.textContent);
                        li.appendChild(newContent);
                        document.getElementById('listissue').appendChild(li);
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