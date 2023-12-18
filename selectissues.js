function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createIssue() {
    var numberOfTabs = 0;
    chrome.tabs.query({}, function(result) {
        numberOfTabs = result.length;
    });
    chrome.storage.sync.get(['txtSelect'], function(result) {
        txt = result.txtSelect || '';
        chrome.storage.sync.get(['urlParam'], function(result) {    
            var urltarget = result.urlParam + '/projects/havea/issues/new';
            var id = '#issue_description';
            chrome.tabs.create({ url: urltarget }, function(newTab) {
                chrome.scripting.executeScript({
                    target: { tabId: newTab.id },
                    function: function(txt, id) {
                    document.querySelector(id).value = txt;
                    },
                    args: [txt, id]
                });
            });
            var numberOfTabsNew = numberOfTabs + 1;
            while (numberOfTabsNew ==  numberOfTabs) {
                chrome.tabs.query({}, function(result) {
                    numberOfTabsNew = result.length;
                });
            };
            sleep(1000).then(() => { window.close(); });
        });
    });
};

function updateIssue(idIssue) {
    var numberOfTabs = 0;
    chrome.tabs.query({}, function(result) {
        numberOfTabs = result.length;
    });
    chrome.storage.sync.get(['txtSelect'], function(result) {
        txt = result.txtSelect || '';
        chrome.storage.sync.get(['urlParam'], function(result) {    
            var urltarget = result.urlParam + '/issues/' + idIssue + "/edit";
            var id = '#issue_notes';
            chrome.tabs.create({ url: urltarget }, function(newTab) {
                chrome.scripting.executeScript({
                    target: { tabId: newTab.id },
                    function: function(txt, id) {
                    document.querySelector(id).value = txt;
                    },
                    args: [txt, id]
                });
            });
            var numberOfTabsNew = numberOfTabs + 1;
            while (numberOfTabsNew ==  numberOfTabs) {
                chrome.tabs.query({}, function(result) {
                    numberOfTabsNew = result.length;
                });
            };
            sleep(1000).then(() => { window.close(); });
        });
    });
};

document.addEventListener('DOMContentLoaded', function() {
    var newIssue = document.getElementById('0');
    
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
                        var id = td.getAttribute("href").split('/').pop();
                        var title = td.textContent;
                        var tr = document.createElement('tr');
                        tr.setAttribute('class', 'cursor-pointer');
                        var td = document.createElement('td');
                        var newContent = document.createTextNode(id);
                        td.appendChild(newContent);
                        tr.appendChild(td);
                        var td = document.createElement('td');
                        var newContent = document.createTextNode(title);
                        td.appendChild(newContent);
                        tr.appendChild(td);
                        document.getElementById('listissue').appendChild(tr);
                        tr.addEventListener('click', function(){updateIssue(id);}, false);
                    });
                } else {
                    console.error('Erreur HTTP! Statut :', xhr.status);
                }
            }
        };
        xhr.send();
    })

    chrome.windows.getCurrent(function (currentWindow) {
        chrome.windows.update(currentWindow.id, { width: 800, height: 500 });
    });
    newIssue.addEventListener('click', createIssue);
});