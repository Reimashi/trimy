$(document).ready(function () {
    $('#search_type').SetupComboBox();
    
    $('#search_form').submit(function () {
        $('#search_box').TriMYHandlerSearch($('#search_needle').val(), $('#search_type').ComboBoxValue());
        return false;
    });
});

// Translate UI
$(document).ready(function () {
    document.title = 'TriMY - ' + chrome.i18n.getMessage('appDescription');
    
    $('[i18n_title]').each(function() {
        var self = $(this);
        self.attr('title', chrome.i18n.getMessage(self.attr('i18n_title')));
    });
    
    $('[i18n]').each(function() {
        var self = $(this);
        self.html(chrome.i18n.getMessage(self.attr('i18n')));
    });
});