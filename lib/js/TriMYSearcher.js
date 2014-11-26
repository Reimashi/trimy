Array.prototype.contains = function (object)
{
    for (i=0;i<this.length;i++) if (this[i]==object) return true;
    return false;
}

var TriMYDownload = function ()
{
    this.name = "";
    this.description = "";
    this.url = "";
    this.type = "und";
    
    this.provider_name = "";
    this.provider_url = "";
}

var TriMYPlugin = function ()
{
    this.uuid = "";
    this.name = "";
    this.version = "";
    this.type = new Array();
    
    this.Search = function(needle, callback) {}
}

var TriMYSearcher = ( function (){
    var self = this;
    var plugins = new Array();
	
	var instanceBlock; // TODO Bloqueo entre busquedas
	var instancePluginStarted;
	var instanceEndFunction;
    
    var ContainsPlugin = function (pl)
    {
        for (i=0;i<plugins.length;i++) if (plugins[i].uuid == pl.uuid) return true;
        return false;
    }
    
    var LoadPlugin = function(pl) {
        if (!ContainsPlugin(pl))
        {
            plugins.push(pl);
            console.log('[TrimY][INFO] Plugin Loaded: ' + pl.name + ' ' + pl.version + ' (' + pl.uuid + ').');
        }
    }
	
	var SearchPluginEnd = function() {
		instancePluginStarted = instancePluginStarted - 1;
		
		if (instancePluginStarted == 0)
		{
			instanceEndFunction();
			console.log('[TrimY][INFO] Search finished!');
		}
	}
    
    var Search = function (needle, type, foundfunc, endfunc)
    {
        console.log('[TrimY][INFO] Search in progress: "' + needle + '"');
		
		instanceEndFunction = endfunc;
		instancePluginStarted = 0;
        
        for (i=0;i<plugins.length;i++)
        {
            if (type == "all" || plugins[i].type.constains(type))
			{
				instancePluginStarted = instancePluginStarted + 1;
                plugins[i].Search(needle, foundfunc, SearchPluginEnd);
			}
        }
    }
    
    console.log('[TrimY][INFO] TriMY Core loaded!');
    
    return {
        LoadPlugin: LoadPlugin,
        Search : Search
    }
})();

/* --- AUDIO PLUGINS -------------------------------------------------------------------------- */

/* GOEAR Plugin */

var TMGoearPlugin = function () {
    this.prototype = new TriMYPlugin();
    
    this.uuid = "472aff75-0387-4dab-8cb0-8f25af19be7a";
    this.name = "Goear";
    this.version = "0.1";
    this.type = new Array("audio");
    
    var url_search = "http://www.goear.com/search/";
    var url_listen = "http://www.goear.com/listen/";
    var url_page_search = "listen/";
    var url_download_tracker = "http://www.goear.com/tracker758.php?f=";
    
    this.Search = function (needle, elemCallback, finalCallback) {
        var pname = this.name;
        
        $.ajax ({
            url: url_search + needle + "/0/played/"
        }).done( function(data) {
            var $elemtodw = $(data).find('ol#results li');
			
			if ($elemtodw.length > 0)
			{
				$elemtodw.each( function () {
					var dwn = new TriMYDownload();
					var thisjo = $(this);
					
					var auxtitle = thisjo.find('.songtitleinformation').html();
					if (typeof auxtitle === 'undefined')
						auxtitle = thisjo.find('.songtitleinfo').html();
					var auxarthist = thisjo.find('.groupnameinformation').html();
					if (typeof auxarthist === 'undefined')
						auxarthist = thisjo.find('.groupnameinfo').html();
					
					dwn.name = auxarthist + ' - ' + auxtitle;
					dwn.description = thisjo.find('p.comment').html();
					dwn.type = "audio";
					
					var dwcode;
					thisjo.find('a').each( function() {
						var tmpcode = $(this).attr('href');
						
						if (tmpcode.search('listen') != -1)
						{
							dwcode = tmpcode.substr(tmpcode.search('listen') + 7, 7);
						}
					});
					
					dwn.provider_name = pname;
					dwn.provider_url = url_listen + dwcode + '/l';
				
					$.ajax ({
						url: url_download_tracker + dwcode
					}).done( function(xml) {
						$(xml).find('song').each( function () {
							dwn.url = $(this).attr('path');
						});
						
						elemCallback(dwn);
					}).done( function() {
						finalCallback();
					});
				});
			}
			else
			{
				finalCallback();
			}
        });
    }
};

TriMYSearcher.LoadPlugin(new TMGoearPlugin());