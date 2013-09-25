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

  var unreadCount = 0,
      watchAuthors = ["Marie Curie", "Susan B. Anthony", "Virginia Wolfe"],
      watchReviewers = ['Your Name'];
      pullsUrls = [
        'http://path-to-your-stash-repo/pull-requests'
       ,'http://path-to-your-other-stash-repo/pull-requests'
      ];

  var getUsersPullRequests = function() {
    var prevOpen = parseInt(localStorage.getItem('userPulls'), 10)
      , currentOpen = 0
    ;
    localStorage.setItem('userPulls', 0);
    pullsUrls.forEach(function(url, key, arr){
      $.get(url, { cb :  Date.now() }, function (data) {
        var currentPulls
          , currentOpen
          , openPulls
          , bounce
        ;
        openPulls = parseUserPullRequests(data);
        currentPulls = parseInt(localStorage.getItem('userPulls'), 10);
        currentOpen = openPulls + currentPulls;
        localStorage.setItem('userPulls', currentOpen);
        bounce = currentOpen > prevOpen;
        setBadge(currentOpen, bounce);
      }, 'html');
    });
  };


  var parseUserPullRequests = function(data) {
    var trs = $(data).find(".pull-request-row")
      , openPulls = 0
    ;

    $(trs).each(function(i, tr){
      $tr = $(tr);
      var authors = $tr.find('td.author img')
        , reviewers = $tr.find('td.reviewers img')
      ;
      authors.each(function(){
        if($.inArray(this.title, watchAuthors) != -1) {
          openPulls++;
        }
      });
      reviewers.each(function(){
        if($.inArray(this.title, watchReviewers) != -1) {
          openPulls++;
        }
      });

    });
    return openPulls;
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

  setInterval(
    getUsersPullRequests,
    90 * 1000);
})(jQuery);
