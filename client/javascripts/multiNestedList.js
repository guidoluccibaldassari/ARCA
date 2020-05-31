// MultiNestedList.js
//The root of all evil:
var TxtRotate;

// Select the main list and add the class "hasSubmenu" in each LI that contains an UL
function enableTree() {
$('ul').each(function(){
  $this = $(this);
  $this.find("li").has("nodes")/*.has("ul")*//*.has("li")*/.addClass("hasSubmenu");
  //console.log('hSm');
});

// Find the last li in each level
$('li:last-child').each(function(){
  $this = $(this);
  // Check if LI has children
  if ($this.children('ul').length === 0){
    // Add border-left in every UL where the last LI has not children
    $this.closest('ul').css("border-left", "1px solid gray");
  } else {
    // Add border in child LI, except in the last one
    $this.closest('ul').children("li").not(":last").css("border-left","1px solid gray");
    // Add the class "addBorderBefore" to create the pseudo-element :defore in the last li
    $this.closest('ul').children("li").last().children("a").addClass("addBorderBefore");
    // Add margin in the first level of the list
    $this.closest('ul').css("margin-top","20px");
    // Add margin in other levels of the list
    $this.closest('ul').find("li").children("ul").css("margin-top","20px");
  };
});

// Add bold in li and levels above
$('nodes li').each(function(){
  $this = $(this);
  $this.mouseenter(function(){
    $( this ).children("a").css({"font-weight":"normal","color":"#F00"});
  });
  $this.mouseleave(function(){
    $( this ).children("a").css({"font-weight":"normal","color":"#000"});
  });
});

// Add button to expand and condense - Using FontAwesome
$('nodes li.hasSubmenu').each(function(){
  $this = $(this);
  $this.prepend("<a href='javascript:void(0);'><i class='fa fa-plus-circle'></i><i style='display:none;' class='fa fa-minus-circle'></i></a>");
  $this.children("a").not(":last").removeClass().addClass("toogle");
});

// Actions to expand and condense
$('nodes li.hasSubmenu a.toogle').click(function(){
  $this = $(this);
  $this.closest("li").children("ul").toggle("slow");
  $this.children("li").toggle();
  return false;
});

}

function initLogoArca() {
//Logo arca
TxtRotate = function(el, toRotate, period) {
  //alert('1');
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  //alert('2');
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];
  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }
  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
  var that = this;
  var delta = 300 - Math.random() * 100;
  if (this.isDeleting) { delta /= 2; }
  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }
  setTimeout(function() {
    that.tick();
  }, delta);
};
}

function initMovingText() {
  //alert('3');
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) 
  {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
};

//Chiude tutti i menu
function collapseALL()
{
//NASCONDE IL MENU
    //alert('Collapse!');
	var uls = document.getElementsByTagName("ul");
	for (i=0;i<uls.length;i++)
	{    
		if(uls[i].className=="Sottomenu") uls[i].style.display = "none";
	}
}

function init_page() {
	//alert('Init!');
	initLogoArca();
	initMovingText();
	setTimeout(function(){
	  enableTree();
	  collapseALL();
	},900);
}
