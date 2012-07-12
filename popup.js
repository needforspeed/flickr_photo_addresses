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

myFlickr.prototype.ready = function ( o )
{
  var self = this;
  
  chrome.extension.onRequest.addListener
  (
    function(request, sender, sendResponse)
    {
      self.url = sender.tab.url;

      if(sender.tab.url=='http://www.flickr.com/photos/organize/')
      {
        self.image_elems.orig = $(request.content).find("div.batch_photo img");
      }
      else
      {
        self.image_elems.orig = $(request.content).find('.rapidnofollow img.pc_img');
      }

      for (var i = 0; i < self.image_elems.orig.length; i++)
      {
        self.image_elems.s[i] = self.image_elems.orig[i].src;
        self.image_elems.m[i] = self.image_elems.orig[i].src.replace(/(.+)\_s(\..+)/, "$1_z$2");
        self.image_elems.l[i] = self.image_elems.orig[i].src.replace(/(.+)\_s(\..+)/, "$1_b$2");
      }
      self.show()
    }
  );

  $('input').bind
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
      if(tab.url.substring(0, 21) != 'http://www.flickr.com')
      {
        self.show();
        return;
      }

      chrome.tabs.executeScript
      (
        tab.id, 
        {
          "code":"chrome.extension.sendRequest({\"content\":document.body.innerHTML})"
        }
      );
    }
  );


}

myFlickr.prototype.show = function ()
{
  var self = this;
  
  $('#processing').removeClass("hide");

  if(!self.image_elems.orig.length)
  {
    $("#na").removeClass("hide");
    $('#processing').addClass("hide");
    $('#links_holder').addClass("hide");
  }

  $('#links_holder').html('');

  self.img_size = $('input.size:checked').val();
  self.photo_number = $('input#photo-number')[0].checked
  self.space_between_lines = $('input#space-between-lines')[0].checked

  for (var i = 0; i < self.image_elems.orig.length; i++)
  {
      if(self.photo_number){
          $('#links_holder').append('<label>'+ (i + 1) + '</label>')
      }
      $('#links_holder').append('<div>' + self.image_elems[self.img_size][i] + '</div>');
      if(self.space_between_lines){
          $('#links_holder').append('<br /><br /><br /><br />')
      }
  };
  
  $('#processing').addClass("hide");
  $('#image_size').html(self.size_mapping[self.img_size]);
  $('#image_size').removeClass();
  $('#image_size').addClass(self.size_mapping[self.img_size]);
}

var mitbbs = new myFlickr();
