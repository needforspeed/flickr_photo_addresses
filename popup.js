function myFlickr()
{
  var self = this;
  var url = "";
  var img_size = "";

  this.image_elems = {"s":[], "m":[], "l":[],"orig":[]};
  this.size_mapping = {"s":"small","m":"medium", "l":"large"};

  $(document).ready
  (
    function(e)
    {
      self.ready(e);
    }
  );
}

function getHTML()
{
    return document.body.outerHTML
}

myFlickr.prototype.ready = function ( o )
{
  var self = this;
  
  $('input:radio').bind
  (
    'click', 
    function () 
    {
      self.show();
    }
  );

  chrome.tabs.getSelected
  (
    null,
    function(tab)
    {
      self.url = tab.url;

      if(self.url.substring(0, 21) != 'http://www.flickr.com')
      {
        alert("This extension only works on http://www.flickr.com domain");
        return;
      }
      else // Photo SET page
      {
        $.get
        (
          tab.url, 
          function(data)
          {
            var page_str = data;
            var page_dom = $(page_str)
            self.image_elems.orig = page_dom.find('.rapidnofollow img.pc_img');
            for (var i = 0; i < self.image_elems.orig.length; i++)
            {
              self.image_elems.s[i] = self.image_elems.orig[i].src;
              self.image_elems.m[i] = self.image_elems.orig[i].src.replace(/(.+)\_s(\..+)/, "$1_z$2");
              self.image_elems.l[i] = self.image_elems.orig[i].src.replace(/(.+)\_s(\..+)/, "$1_b$2");
            }
            self.show()
          }
        );
      }
    }
  );
}

myFlickr.prototype.show = function ()
{
  var self = this;
  
  $('#processing').removeClass("hide");
  $('#links_holder').html('');

  self.img_size = $('input:checked').val();

  for (var i = 0; i < self.image_elems.orig.length; i++)
  {
    $('#links_holder').append('<div>' + self.image_elems[self.img_size][i] + '</div>');
  };
  
  $('#processing').addClass("hide");
  $('#image_size').html(self.size_mapping[self.img_size]);
  $('#image_size').removeClass();
  $('#image_size').addClass(self.size_mapping[self.img_size]);
}

var mitbbs = new myFlickr();
