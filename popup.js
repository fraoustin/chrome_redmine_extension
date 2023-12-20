document.addEventListener('DOMContentLoaded', function() {
    var urlInput = document.getElementById('urlInput');
    var saveButton = document.getElementById('saveButton');
  
    // Charger la valeur actuelle du paramètre URL et l'afficher dans l'input
    chrome.storage.sync.get(['urlParam'], function(result) {
      urlInput.value = result.urlParam || '';
    });
    chrome.storage.sync.get(['projectParam'], function(result) {
      projectInput.value = result.projectParam || '';
    });
    chrome.storage.sync.get(['carComment'], function(result) {
      carComment.value = result.carComment || '';
    });
  
    // Enregistrer la nouvelle valeur du paramètre URL
    saveButton.addEventListener('click', function() {
      var newUrl = urlInput.value;
      chrome.storage.sync.set({ 'urlParam': newUrl }, function() {
        console.log('Paramètre URL enregistré : ' + newUrl);
      });
      var newProject = projectInput.value;
      chrome.storage.sync.set({ 'projectParam': newProject }, function() {
        console.log('Paramètre Project enregistré : ' + newProject);
      });
      var carComment = carComment.value;
      chrome.storage.sync.set({ 'carComment': carComment }, function() {
        console.log('Paramètre carComment enregistré : ' + carComment);
      });
    });
});