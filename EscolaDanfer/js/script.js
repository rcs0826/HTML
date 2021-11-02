$(document).ready(function(){
	var images = [
	    {
	        src: './images/CA-wp3.jpg',
	        alt: 'First image',
	        title: 'First image',
	        description: 'First image description',
	        linktarget: '_blank',
	        linkhref: 'http://www.fluig.com',
	        linktext: 'fluig'
	    },
	    {
	        src: './images/CA-wp4.jpg',
	        alt: 'Second image',
	        title: 'Second image',
	        description: 'Second image description',
	        linktarget: '_blank',
	        linkhref: 'http://style.fluig.com',
	        linktext: 'Style Guide'
	    }
	];
	 
	var settings = {
	    id: 'myFluigCarouselExample',
	    images: images,
	    indicators: true,
	    startIndex: 0,
	    interval: 5000,
	    autoSize:true
	};
	 
	var carousel = FLUIGC.carousel('#carousel-example-generic', settings);
	carousel.play();
});
