// JavaScript Document
    jQuery(function($){
        $("#twitter").tweet({
          avatar_size: 32,
          count: 2,
          username: "eddie255",
          template: "{text} » {retweet_action}"
        });
      }).bind("loaded", function(){
        $(this).find("a.tweet_action").click(function(ev) {
          window.open(this.href, "Retweet", 'menubar=0,resizable=0,width=550,height=420,top=200,left=400');
          ev.preventDefault();
        });
      });