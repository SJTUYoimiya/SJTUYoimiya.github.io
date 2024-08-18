window.onscroll = function() {
    var navbar = document.querySelector('.navbar');
    if (window.pageYOffset > 100) {  // 页面滚动超过100px时
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  