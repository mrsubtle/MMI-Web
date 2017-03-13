/*
  core.js
  Jan 6, 2017
  v 1.0.0
  rbennett@pbl.ca
*/

var app = {
  data : {},
  getData : function(){
    return $.ajax({
			url:		"js/data/apps.json?nocache=" + (new Date()).getTime(),
			method:	"GET",
  		cache:	false
		})
      .done(function(appData){
        console.log("Retrieved App JSON");
        console.log(appData);
        appData = _.sortBy(appData, function(o) { return o.name; });
        app.data = appData;
        //trigger rendering of the data
        app.render(appData).then(
          app.initEvents()
        );
      })
      .fail(function(error){
        console.error("Failed retrieving App JSON");
        console.error(error);
      })
      .always(function(){
        console.log("Done retrieving App JSON");
      });
  },
  selectApp : function(appObject){
		console.log(appObject);
		if (appObject.featureURL != null) {
			$('section.main').css('background-image', 'url('+appObject.featureURL+')');
			if (appObject.featureFill == true) {
				$('section.main').css('background-size', 'cover');
			}
			if (appObject.featureFill == false) {
				$('section.main').css('background-size', 'contain');
			}
		} else {
			$('section.main').css('background-image', 'url(img/blank-iPhone6.png)');
			$('section.main').css('background-size', 'contain');
		}
    var actionsContainerContentTemplate = _.template( $('#tpl_actions-container-content').html() );
    $('.actions-container').html(actionsContainerContentTemplate(appObject));
  },
  render : function(dataToRender){
    return $.Deferred(function( arf ) {
        console.log('Start rendering ' + dataToRender.length + ' apps.');
        //clear list for dataToRender
        $('.app-list-container').html('');
        $('form#requests #ogApps').html('');
        var appListItemTemplate = _.template( $('#tpl_app-list-item').html() );

        _.each(dataToRender, function(o,i,a){
          o.arrayindex = i;
					if(o.enable == true){
						$('.app-list-container').append(appListItemTemplate(o));
	          $('form#requests #ogApps').append('<option value="'+o.name+'">'+o.name+'</option>');
					}
        });

        //Auto-select the last app?
        //app.selectApp(dataToRender[(dataToRender.length - 1)]);
        //render stuff here

        arf.resolve();
      }).promise();
  },
  initEvents : function(){
    $('.app-list-container .app-list-item').on('click', function(ev){
      app.selectApp(app.data[parseInt($(this).data('arrayindex'))]);
    });
  }
};

$(function() {
  // DEBUG
  console.log('Ready');
  app.getData();
});
