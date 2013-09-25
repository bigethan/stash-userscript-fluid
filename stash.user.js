// ==UserScript==
/*jshint laxcomma:true */
// @name        StashHelper
// @description Unread notifcation tracking and icon bouncing
// @namespace   http://bigethan.com/
// @homepage    http://github.com/bigethan/github/
// @author      Ethan Schlenker
// @include     http*://stash*
// ==/UserScript==

(function ($) {

  var baseUrl = 'http://your-stash-host/rest/inbox/latest/pull-requests/count'
    , userPullsKey = 'userPulls';

  var getUsersPullRequests = function()
  {
    var prevOpen = parseInt(localStorage.getItem(userPullsKey), 10)
      , currentOpen = 0
    ;
    $.get(baseUrl, { cb :  Date.now() }, function (data) {
      currentOpen = parseInt(data.count, 10);
      localStorage.setItem(userPullsKey, currentOpen);
      setBadge(currentOpen, currentOpen > prevOpen);
    }, 'json');
  };


  var setBadge = function(badgeString, bounce)
  {
    if(window.fluid) {
      window.fluid.dockBadge = badgeString > 0 ? badgeString : null;
      if(bounce === true) {
        window.fluid.requestUserAttention(false); // bounce once if soemthing came in
      }
    }
  };

  getUsersPullRequests();
  setInterval( getUsersPullRequests, 30 * 1000);

})(jQuery);
