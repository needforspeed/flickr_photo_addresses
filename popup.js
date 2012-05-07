function myFlickr() {
  var self = this;
  var url = "";
  var img_size = "";

  this.image_elems = {"s":[], "m":[], "l":[]};
  this.size_mapping = {"small":"s","medium":"z", "large":"b"};

  $(document).ready(
    function(e){
      self.ready(e);
    }
  );
}

function getHTML(){
    return document.body.outerHTML
}

myFlickr.prototype.ready = function ( o ) {

  var self = this;

  chrome.tabs.getSelected(
    null,
    function(tab) {

      self.url = tab.url;

      if(self.url.substring(0, 21) != 'http://www.flickr.com')
      {
        alert("This extension only works on http://www.flickr.com domain");
        return;
      }
      /*
      // no way to figure out how this work on organize page yet...
      else if(self.url.substring(0, 38) == 'http://www.flickr.com/photos/organize/')
      {
        $.get(
          tab.url, 
          function(data)
          {
            var page_str = data;
            var page_dom = $(page_str)
            self.image_elems.s = page_dom.find('.batch_photo_img_div img');
          }
        );
      }
      */
      else // Photo SET page
      {
        $.get(
          tab.url, 
          function(data)
          {
            var page_str = data;
            var page_dom = $(page_str)
            self.image_elems.s = page_dom.find('.rapidnofollow img.pc_img');
            for (var i = 0; i < self.image_elems.s.length; i++) {
              self.image_elems.m[i] = self.image_elems.s[i].src.replace(/(.+)\_s(\..+)/, "$1_z$2");
              self.image_elems.l[i] = self.image_elems.s[i].src.replace(/(.+)\_s(\..+)/, "$1_b$2");
            }

            self.show()
          }
        );
      }
    }
  );
}

myFlickr.prototype.show = function (o)
{
  var self = this;
  if(typeof o === 'undefined')
  {
    self.img_size = "medium";
  }

  for (var i = 0; i < self.image_elems.s.length; i++) {
    $('#links_holder').append('<div>' + self.image_elems.m[i] + '</div>');
  };
  
  $('#processing').addClass("hide");
}

var mitbbs = new myFlickr();
