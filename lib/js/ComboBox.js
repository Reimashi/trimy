$.fn.SetupComboBox = function () {
    var self = $(this);
    
    if (self.hasClass('combobox'))
    {
        self.find('a').unbind("click").click (function () {
            self.find('li a').removeClass('selected');
            var option = $(this).attr('href');
            self.find('li#cb_value').html(option.substr(4, option.length - 4));
            $(this).addClass("selected");
            return false;
        });
    }
}

$.fn.ComboBoxValue = function () {
    var self = $(this);
    
    if (self.hasClass('combobox'))
    {
        return self.find('li#cb_value').html();
    }
    
    return '';
}