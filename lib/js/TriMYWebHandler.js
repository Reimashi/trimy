var TC_DownloadFile = function (dwurl, name, ext) {
    var dwname = name;
    
    if (typeof ext === "undefined") {
        ext = dwurl.split('.').pop().replace("/", "");
    }
    
    dwname += "." + ext;
    
    console.log('Downloading file: ' + dwname);
    chrome.downloads.download({url: dwurl, filename: dwname});
    return false;
}

var TriMYWebHandler = ( function (){
    var self = this;
    var container = "";
    
    var SetContainer = function (elem)
    {
        container = elem;
    }
    
    var Clean = function ()
    {
        $(container).html('');
    }
    
    var ShowSearchBar = function (showbool)
    {
        if (showbool)
            $('#search_in_progress').fadeIn('slow');
        else
            $('#search_in_progress').fadeOut('slow');
    }

    var HideSearchBar = function ()
    {
        return this.ShowSearchBar(false);
    }

    var ShowItem = function (item) {
        $(container).append('<div class="download dwtype_' + item.type + '">\
                                <div class="download_head">\
                                    <span class="download_title">\
                                        <a target="_blank" href="' + item.provider_url + '">' + item.name + '</a>\
                                    </span>\
                                    <span class="download_actions">\
                                        <a target="_blank" class="link_button download_button" id="' + item.name + '" href="' + item.url + '">' + chrome.i18n.getMessage('download') + '</a>\
                                    </span>\
                                </div>\
                                <div class="download_provider">\
                                    ' + item.provider_name + ' &raquo; ' + item.provider_url + '\
                                </div>\
                                <div class="download_description">\
                                    ' + item.description + '\
                                </div>\
                            </div>');
        
        InstallHandlers();
    }
    
    var SearchStart = function () {
        Clean();
        ShowSearchBar(true);
    }
    
    var SearchEnd = function () {
        ShowSearchBar(false);
    }
    
    var InstallHandlers = function () 
    {
        $('a.download_button').unbind("click").click (function () {
            return TC_DownloadFile($(this).attr('href'), $(this).attr('id'));
        });
    }
    
    return {
        SearchStart: SearchStart,
        SearchEnd: SearchEnd,
        ShowItem: ShowItem,
        SetContainer: SetContainer
    }
})();

$.fn.TriMYHandlerSearch = function (needle, type) {
    this.each(function(){
        TriMYWebHandler.SetContainer(this);
        TriMYWebHandler.SearchStart();
        TriMYSearcher.Search(needle, type, TriMYWebHandler.ShowItem, TriMYWebHandler.SearchEnd);
    });
}