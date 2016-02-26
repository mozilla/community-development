// Template Things, this code...
//
// * Takes the content from the content.md file in the same folder and
//   * Converts it into HTML
//   * Creates a side-bar navigation based on the h1 and h2 elements in that content
// * Highlights the appropriate element in the navigation when a user scrolls through the page
//   * Also changes the hash in the address bar to match the current section
// * Scrolls to appropriate section of the page when a user clicks an item in the navigation
// * When the page first loads, checks to see if there is a hash in the address bar and
//   loads the appropriate section if so

var sections = [];
var articleSections = $();
var autoscrolling = false;
var docHeight, windowHeight, scrollingTimeout, converter;
var scrollSpeed = 500;  // Time (in ms) it takes to scroll to a new section when a user clicks the navigation
var lastScroll = 0;

$(document).ready(function(){
  windowHeight = $(window).height();

  converter = new Markdown.Converter();
  Markdown.Extra.init(converter);

  getContent();

  $("nav").on("click","a",function(){
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
    var section = $(this).attr("href").replace("#","");
    scrollToSection(section);
    return false;
  });

  $(window).on("scroll",function(){
    if(autoscrolling == false) {
      scroll();
    }
  });

  $(window).on("resize",function(){
    checkLayout();
  });
});

// Loads the h1 and h2 used for navigations into a javascript collection
// and keeps track of them to help out with navigation.

function prepareSections(){
  $("nav a").each(function(i,el){
    var sectionName = $(el).attr("href");
    if(sectionName.length > 0) {
      sectionName = sectionName.replace("#","").toLowerCase();
      sections.push(sectionName);
    }
  });

  var idThings = $("*[id]");
  $(idThings).each(function(i,el){
    var id = $(el).attr("id");
    id = id.replace("#","").toLowerCase();
    if(sections.indexOf(id) > -1) {
      articleSections.push(el);
    }
  });
}

// Updates the nav depending on what part of the article a user scrolls to

function scroll(){
  var windowTop = $(window).scrollTop();

  articleSections.each(function(i,el){
    var offset = $(el).offset();
    var fromTop = offset.top - windowTop;
    if(fromTop >= 0 && fromTop < 400) {
      var id = $(el).attr('id');
      selectSection(id);
    }
  });

  if(windowTop + windowHeight == docHeight){
    var last = articleSections[articleSections.length - 1];
    var id = $(last).attr('id');
    selectSection(id);
  }

  positionNav();
}

function positionNav(){
  var maxOffset = $("aside").outerHeight() - $(window).height();
  var scrollDelta = $(window).scrollTop() - lastScroll;
  lastScroll = $(window).scrollTop();
  var asideTop = parseInt($("aside").css("top"));

  if(maxOffset > 0) {
    if(scrollDelta > 0) {
      //scrolling down
      var jam = $(window).height() - asideTop - $("aside").height();
      if(jam < 0) {
        $("aside").css("top", asideTop - scrollDelta);
      }
    } else {
      //Scrolling up
      if(asideTop < 0) {
        $("aside").css("top", asideTop - scrollDelta);
      }
    }
    if(asideTop > 0) {
      asideTop = 0;
      $("aside").css("top", 0);
    }
    if(Math.abs(asideTop) > maxOffset){
      $("aside").css("top", -1 * maxOffset);
    }
  }
}

// Builds HTML based content in content.md

function buildContent(html){
  var pageTitle;

  $("article").attr("id","introduction");
  $("nav").append("<a class='selected' href='#introduction'>Introduction</a>");

  $(html).each(function(i,el){

    // Loops through all of the elements in the page
    if($(el).prop("nodeName")){

      $("article").append($(el));

      // Adds elements to the Nav if they're h1 or h2 headings
      if($(el).prop("nodeName") == "H1") {
        if(!pageTitle) {
          pageTitle = $(el).text();
        }
      }

      if($(el).prop("nodeName") == "H2") {
        var text = $(el).text();
        var id = text.replace(/[^a-zA-Z0-9]+/g, "-");
        var id = id.toLowerCase();
        $(el).attr("id",id);
        $("nav").append("<a href='#"+id+"'>"+text+"</a>");
      }
    }
  });

  prepareSections();
  $("title").text(pageTitle);
  docHeight = $("body").height();
  checkHash();
  checkLayout();
  positionNav();
}


// Hides the sidebar image if there isn't a lot of room.

function checkLayout(){
  var windowHeight = $(window).height();
  var asideHeight = $("nav").height() + $("aside .image").height() + 55;
  if(asideHeight > windowHeight){
    $(".image").hide();
  } else {
    $(".image").show();
    $("aside").css("top",0);
  }
}

//Gets the content.md file found in the same folder

function getContent(){
  $.ajax({
    url: "content.md",
    success: function (resp) {
      buildContent(converter.makeHtml(resp));
    },
    error: function(e) {
      console.log(e);
    }
  });
}

// Highlights a section in the left-side navigation

function selectSection(id){
  if(sections.indexOf(id) < 0){
    id = "introduction";
  }

  $("nav .selected").removeClass("selected");
  $("nav a[href=#"+id+"]").addClass("selected");

  if(window.history.replaceState) {
    window.history.replaceState(null, null, "#" + id);
  }
}

// Checks the hash value in the address bar and selects
// the appropriate section in the nav

function checkHash(){
  var hash = window.location.hash;
  if(hash){
    var section = hash.replace("#","");
    if(sections.indexOf(section) > 0) {
      selectSection(section);
      scrollToSection(section);
    }
  }
}

// Scrolls to the selected section when
// a) user clicks the left-side nav
// b) a hash is found in the address bar when page loads

function scrollToSection(section){
  autoscrolling = true;
  window.clearTimeout(scrollingTimeout);

  scrollingTimeout = window.setTimeout(function(){
    autoscrolling = false;
  },parseInt(scrollSpeed + 100));

  $('html, body').animate({
    scrollTop: $("#" + section).offset().top
  }, scrollSpeed, function(){
    window.location.hash = section;
  });
}
