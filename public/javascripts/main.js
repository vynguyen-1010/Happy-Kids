$(function () {
    new WOW().init();
    // TweenMax.staggerFrom($('.content-shop-collection .right li:nth-child(1), .content-shop-collection .right li:nth-child(2), .content-shop-collection .right li:nth-child(3)'), 2, {top: 100, opacity: 0}, 0.1);
    //hieu ung cho menu
    $(window).scroll(function () { 
        var vitri = $('html').scrollTop();
        if(vitri>=200){
            $('.menu').addClass('fixed');
        }
        else{
            $('.menu').removeClass('fixed');
        }
    });
    // hieu ung cho phan top-header
    $('.top-header span:nth-child(1)').addClass('an');
    setInterval(function () {
        $('.top-header span:nth-child(1)').toggleClass('an');
        $('.top-header span:nth-child(2)').toggleClass('an');
    }, 6000);
    //hieu ung cho cart - gio hang
    $('.icon-cart, button.addtocart').click(function (e) { 
        e.preventDefault();
        $('.modal-box-cart').addClass('hien');
        $('.modal-box-cart .cart .title img').click(function (e) { 
            e.preventDefault();
            $('.modal-box-cart').removeClass('hien');
        });
    });
    // //hieu ung cho login
    // $('.icon-user').click(function (e) { 
    //     e.preventDefault();
    //     $('.login').addClass('hien');
    //     $('.login button.hide').click(function (e) { 
    //         e.preventDefault();
    //         $('.login').removeClass('hien');
    //     });
    //     $('.sign-up button.hide').click(function (e) { 
    //         e.preventDefault();
    //         $('.sign-up').removeClass('hien');
    //     });
    //     $('a.link-sign-up').click(function (e) { 
    //         e.preventDefault();
    //         $('.sign-up').addClass('hien');
    //         $('.login').removeClass('hien');
    //     });
    //     $('a.link-login').click(function (e) { 
    //         e.preventDefault();
    //         $('.sign-up').removeClass('hien');
    //         $('.login').addClass('hien');
    //     });
    // });

    //hieu ung accordion cho filter shop-collection
    $('.content-shop-collection .left .color ul').slideUp();
    $('.content-shop-collection .left .collection ul').slideDown();
    $('.content-shop-collection .left .collection p').click(function (e) { 
        e.preventDefault();
        $('.content-shop-collection .left .collection ul').slideToggle();
    });
    $('.content-shop-collection .left .color p').click(function (e) { 
        e.preventDefault();
        $('.content-shop-collection .left .color ul').slideToggle();
    });

    //hieu ung accordion cho item
    var i = $('.content-item .product-info span.float-right').text();
    console.log(i);
    $('.content-item .product-info p').slideUp();
    $('.content-item .product-info span' ).click(function (e) { 
        e.preventDefault();
        $('.content-item .product-info p').slideToggle();
    });
    $('.content-item .return p').slideDown();
    $('.content-item .return span' ).click(function (e) { 
        e.preventDefault();
        $('.content-item .return p').slideToggle();
    });
    //hieu ung filter cho shop collection
    // $('.content-shop-collection .right .container .row').isotope({
    //     itemSelector: 'li'
    // });
    //Code cho filter
    // $('.content-shop-collection ul li a').click(function (e) { 
    //     e.preventDefault();
    //     var cat = $(this).data('class'); // catergory
    //     //var title = $(this).text();
    //     //$('.jumbotron h4.display-4').text(title);
    //     if(cat == "all"){
    //         $('.content-shop-collection .right .container .row ul').isotope({
    //             filter: "*"
    //         })
    //     }else{
    //         $('.content-shop-collection .right .container .row ul').isotope({
    //             filter: "." + cat
    //         })
    //     }
    // });
});