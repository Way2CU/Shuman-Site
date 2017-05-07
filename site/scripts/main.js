/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};

/**
 * Function called when document and images have been completely loaded.
 */
function dialog() {
	var video_dialog = new Caracal.Dialog();
	video_dialog.set_title(language_handler.getText(null, 'dialog_video_title'));
	video_dialog.set_size(550, 366);

	$('a.youtube').not('.mobile').click(function(event) {
		// prevent link from working.
		event.preventDefault();

		// set content from URL and show it.
		video_dialog.set_content_from_url($(this).attr('href'));
		video_dialog.open_when_ready();
		video_dialog.set_clear_on_close(true);
	});
}

Site.on_load = function() {
	if (!Site.is_mobile())
		dialog();

	var thankyou = "/thankyou" + window.location.search;

	// handle analytics event
	var handle_submit = function(data) {
		if (!data.error)
			dataLayer.push({'event': 'leadSent'});
		window.location.replace(thankyou);
		return true;
	};

	for (var i=0, count=Caracal.ContactForm.list.count; i<count; i++) {
		var form = Caracal.ContactForm.list[i];
		form.events.connect('submit-success', handle_submit);
	}
};


// connect document `load` event with handler function
$(Site.on_load);
